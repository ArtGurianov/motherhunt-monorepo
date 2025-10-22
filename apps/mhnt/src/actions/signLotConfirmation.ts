"use server";

import { prismaClient } from "@/lib/db";
import { createActionResponse } from "@/lib/utils/createActionResponse";
import { APIError } from "better-auth/api";
import { revalidatePath } from "next/cache";
import { sendEmail } from "./sendEmail";
import { getAppLocale, getAppURL } from "@shared/ui/lib/utils";
import { stringToBytes32 } from "@/lib/web3/stringToBytes32";
import { viemClient } from "@/lib/web3/viemClient";
import { auctionContractAbi } from "@/lib/web3/abi";
import { getEnvConfigServer } from "@/lib/config/env";
import { lotChainSchema } from "@/lib/schemas/lotChainSchema";
import { ZERO_BYTES } from "@/lib/web3/constants";
import { canAccessCustomRole } from "@/lib/auth/permissions/checkers";
import { ORG_ENTITIES } from "@/lib/auth/permissions/org-permissions";
import { CUSTOM_MEMBER_ROLES, CustomMemberRole } from "@/lib/auth/customRoles";

const ALLOWED_CUSTOM_ROLES: CustomMemberRole[] = [
  CUSTOM_MEMBER_ROLES.MODEL_ROLE,
] as const;

const locale = getAppLocale();

interface SignLotConfirmationProps {
  lotId: string;
}

export const signLotConfirmation = async ({
  lotId,
}: SignLotConfirmationProps) => {
  try {
    const result = await canAccessCustomRole(
      ORG_ENTITIES.LOT,
      "update",
      ALLOWED_CUSTOM_ROLES,
    );
    if (!result.canAccess)
      throw new APIError("FORBIDDEN", { message: "Access Denied" });

    const { userId, userEmail } = result;

    const lotData = await prismaClient.lot.findUnique({ where: { id: lotId } });

    if (!lotData) {
      throw new APIError("NOT_FOUND", {
        message: "Lot data not found",
      });
    }

    if (lotData.signedByUserId)
      throw new APIError("CONFLICT", {
        message: "Already signed",
      });

    if (lotData.email !== userEmail)
      throw new APIError("FORBIDDEN", {
        message: "Must sign in with same email used in invitation",
      });

    const scouterData = await prismaClient.user.findUnique({
      where: { id: lotData.scouterId },
    });

    if (!scouterData) {
      throw new APIError("NOT_FOUND", {
        message: "Scouter data not found",
      });
    }

    const chainLotData = await viemClient.readContract({
      abi: auctionContractAbi,
      address: getEnvConfigServer()
        .NEXT_PUBLIC_AUCTION_CONTRACT_ADDRESS as `0x${string}`,
      functionName: "getLotData",
      args: [stringToBytes32(userId)],
    });

    const validationResult = lotChainSchema.safeParse(chainLotData);

    if (validationResult.error)
      throw new APIError("INTERNAL_SERVER_ERROR", {
        message: "Onchain Lot data parsing error",
      });

    if (validationResult.data.scouterId !== ZERO_BYTES)
      throw new APIError("CONFLICT", {
        message: "Already registered on chain",
      });

    await prismaClient.lot.update({
      where: { id: lotId },
      data: { signedByUserId: userId },
    });

    await sendEmail({
      to: scouterData.email,
      subject: "Model Profile confirmed.",
      meta: {
        description: "Model Profile confirmed.",
        link: `${getAppURL(locale)}/auction/${lotId}`,
      },
    });

    revalidatePath(`/auction/${lotId}`);
    revalidatePath(`/confirmation/${lotId}`);

    return createActionResponse();
  } catch (error) {
    return createActionResponse({ error });
  }
};
