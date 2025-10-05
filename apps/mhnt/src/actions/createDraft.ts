"use server";

import { CUSTOM_MEMBER_ROLES, CustomMemberRole } from "@/lib/auth/customRoles";
import { canAccessCustomRole } from "@/lib/auth/permissions/checkers";
import { ORG_ENTITIES } from "@/lib/auth/permissions/org-permissions";
import { getEnvConfigServer } from "@/lib/config/env";
import { prismaClient } from "@/lib/db";
import { createActionResponse } from "@/lib/utils/createActionResponse";
import { generateNicknameOptions } from "@/lib/utils/generateRandomNickname";
import { auctionContractAbi } from "@/lib/web3/abi";
import { stringToBytes32 } from "@/lib/web3/stringToBytes32";
import { viemClient } from "@/lib/web3/viemClient";
import { AppBusinessError } from "@/lib/utils/errorUtils";
import { APIError } from "better-auth/api";
import { revalidateTag } from "next/cache";
import z from "zod";

const ALLOWED_CUSTOM_ROLES: CustomMemberRole[] = [
  CUSTOM_MEMBER_ROLES.SCOUTER_ROLE,
] as const;

const MAX_DRAFTS_NUMBER = 3;

export const createDraft = async () => {
  try {
    const result = await canAccessCustomRole(
      ORG_ENTITIES.LOT,
      "create",
      ALLOWED_CUSTOM_ROLES
    );
    if (!result.canAccess)
      throw new APIError("FORBIDDEN", { message: "Access Denied" });

    const { userId } = result;

    const offChainNumber = await prismaClient.lot.count({
      where: { scouterId: userId, isOnChain: false },
    });

    const onChainNumberResult = await viemClient.readContract({
      abi: auctionContractAbi,
      address: getEnvConfigServer()
        .NEXT_PUBLIC_AUCTION_CONTRACT_ADDRESS as `0x${string}`,
      functionName: "getScouterLotsNumber",
      args: [stringToBytes32(userId)],
    });

    const verificationResult = z.bigint().safeParse(onChainNumberResult);

    if (verificationResult.error)
      throw new APIError("INTERNAL_SERVER_ERROR", {
        message: "Lots number parsing error",
      });

    if (offChainNumber - Number(verificationResult.data) >= MAX_DRAFTS_NUMBER) {
      throw new AppBusinessError("Allowed drafts limit reached", 400);
    }

    const nicknameOptions = generateNicknameOptions();

    const newDraft = await prismaClient.lot.create({
      data: {
        nicknameOptionsJson: JSON.stringify(nicknameOptions),
        scouterId: userId,
      },
    });

    revalidateTag(`drafts:${userId}`);

    return createActionResponse({ data: newDraft.id });
  } catch (error) {
    return createActionResponse({ error });
  }
};
