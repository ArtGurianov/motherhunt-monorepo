"use server";

import auth from "@/lib/auth/auth";
import { getEnvConfigServer } from "@/lib/config/env";
import { prismaClient } from "@/lib/db";
import { createActionResponse } from "@/lib/utils/createActionResponse";
import { auctionContractAbi } from "@/lib/web3/abi";
import { stringToBytes32 } from "@/lib/web3/stringToBytes32";
import { viemClient } from "@/lib/web3/viemClient";
import { AppClientError } from "@shared/ui/lib/utils/appClientError";
import { APIError } from "better-auth/api";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import z from "zod";

const MAX_DRAFTS_NUMBER = 3;

export const createDraft = async () => {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });
    if (!session)
      throw new APIError("UNAUTHORIZED", { message: "Unauthorized" });

    const offChainNumber = await prismaClient.lot.count({
      where: { scouterId: session.session.userId },
    });

    const onChainNumberResult = await viemClient.readContract({
      abi: auctionContractAbi,
      address: getEnvConfigServer()
        .NEXT_PUBLIC_AUCTION_CONTRACT_ADDRESS as `0x${string}`,
      functionName: "getScouterLotsNumber",
      args: [stringToBytes32(session.session.userId)],
    });

    const verificationResult = z.bigint().safeParse(onChainNumberResult);

    if (verificationResult.error)
      throw new APIError("INTERNAL_SERVER_ERROR", {
        message: "Lots number parsing error",
      });

    if (offChainNumber - Number(verificationResult.data) >= MAX_DRAFTS_NUMBER) {
      throw new AppClientError("Allowed drafts limit reached.");
    }

    // TODO: GENERATE AND SAVE NAME ALIAS
    const newDraft = await prismaClient.lot.create({
      data: { scouterId: session.session.userId },
    });

    revalidatePath("/hunt/drafts");

    return createActionResponse({ data: newDraft.id });
  } catch (error) {
    return createActionResponse({ error });
  }
};
