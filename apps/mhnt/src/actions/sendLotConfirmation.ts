"use server";

import { prismaClient } from "@/lib/db";
import { createActionResponse } from "@/lib/utils/createActionResponse";
import { AppBusinessError } from "@/lib/utils/errorUtils";
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
  CUSTOM_MEMBER_ROLES.SCOUTER_ROLE,
] as const;

const locale = getAppLocale();

interface SendLotConfirmationProps {
  lotId: string;
}

export const sendLotConfirmation = async ({
  lotId,
}: SendLotConfirmationProps) => {
  try {
    const result = await canAccessCustomRole(
      ORG_ENTITIES.LOT,
      "update",
      ALLOWED_CUSTOM_ROLES
    );
    if (!result.canAccess)
      throw new APIError("FORBIDDEN", { message: "Access Denied" });

    const { userId, userEmail } = result;

    const lotData = await prismaClient.lot.findUnique({ where: { id: lotId } });

    if (lotData?.scouterId !== userId)
      throw new APIError("FORBIDDEN", {
        message: "Not a lot creator",
      });

    if (lotData.isConfirmationEmailSent)
      throw new AppBusinessError(
        "Need to cancel previous confirmation email first.",
        400
      );

    if (lotData.signedByUserId)
      throw new AppBusinessError("Already confirmed", 400);

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
      data: { signedByUserId: null, isConfirmationEmailSent: true },
    });

    await sendEmail({
      to: userEmail,
      subject: "Model Profile confirmation request.",
      meta: {
        description: "Model Profile confirmation request.",
        link: `${getAppURL(locale)}/model/confirmation/${lotId}`,
      },
    });

    revalidatePath(`/hunt/drafts/${lotId}`);

    return createActionResponse();
  } catch (error) {
    return createActionResponse({ error });
  }
};
