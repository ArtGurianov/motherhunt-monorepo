"use server";

import { prismaClient } from "@/lib/db";
import { createActionResponse } from "@/lib/utils/createActionResponse";
import { AppBusinessError } from "@/lib/utils/errorUtils";
import { APIError } from "better-auth/api";
import { revalidatePath } from "next/cache";
import { viemClient } from "@/lib/web3/viemClient";
import { auctionContractAbi } from "@/lib/web3/abi";
import { getEnvConfigServer } from "@/lib/config/env";
import { stringToBytes32 } from "@/lib/web3/stringToBytes32";
import { lotChainSchema } from "@/lib/schemas/lotChainSchema";
import { ZERO_BYTES } from "@/lib/web3/constants";
import { canAccessCustomRole } from "@/lib/auth/permissions/checkers";
import { ORG_ENTITIES } from "@/lib/auth/permissions/org-permissions";
import { CUSTOM_MEMBER_ROLES, CustomMemberRole } from "@/lib/auth/customRoles";
import { buildDynamicRoutePath } from "@/lib/utils/buildDynamicRoutePath";
import { APP_ROUTES, APP_ROUTES_CONFIG } from "@/lib/routes/routes";

const ALLOWED_CUSTOM_ROLES: CustomMemberRole[] = [
  CUSTOM_MEMBER_ROLES.SCOUTER_ROLE,
] as const;
interface CancelLotConfirmationProps {
  lotId: string;
}

export const calcelLotConfirmation = async ({
  lotId,
}: CancelLotConfirmationProps) => {
  try {
    const result = await canAccessCustomRole(
      ORG_ENTITIES.LOT,
      "cancel",
      ALLOWED_CUSTOM_ROLES
    );
    if (!result.canAccess)
      throw new APIError("FORBIDDEN", { message: "Access Denied" });

    const { userId } = result;

    const lotData = await prismaClient.lot.findUnique({ where: { id: lotId } });

    if (lotData?.scouterId !== userId)
      throw new APIError("FORBIDDEN", {
        message: "Not a lot creator",
      });

    if (!lotData.isConfirmationEmailSent)
      throw new AppBusinessError("Confirmation email not sent", 400);

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
      data: { signedByUserId: null, isConfirmationEmailSent: false },
    });

    revalidatePath(
      buildDynamicRoutePath(APP_ROUTES_CONFIG[APP_ROUTES.DRAFT].href, {
        id: lotId,
      })
    );

    return createActionResponse();
  } catch (error) {
    return createActionResponse({ error });
  }
};
