"use server";

import auth from "@/lib/auth/auth";
import { prismaClient } from "@/lib/db";
import { createActionResponse } from "@/lib/utils/createActionResponse";
import { AppClientError } from "@shared/ui/lib/utils/appClientError";
import { APIError } from "better-auth/api";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { sendEmail } from "./sendEmail";
import { getAppLocale, getAppURL } from "@shared/ui/lib/utils";
import { stringToBytes32 } from "@/lib/web3/stringToBytes32";
import { viemClient } from "@/lib/web3/viemClient";
import { auctionContractAbi } from "@/lib/web3/abi";
import { getEnvConfigServer } from "@/lib/config/env";
import { lotChainSchema } from "@/lib/schemas/lotChainSchema";
import { ZERO_BYTES } from "@/lib/web3/constants";

const locale = getAppLocale();

interface SendLotConfirmationProps {
  lotId: string;
}

export const sendLotConfirmation = async ({
  lotId,
}: SendLotConfirmationProps) => {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });
    if (!session)
      throw new APIError("UNAUTHORIZED", { message: "Unauthorized" });

    const lotData = await prismaClient.lot.findUnique({ where: { id: lotId } });

    if (lotData?.scouterId !== session.session.userId)
      throw new APIError("FORBIDDEN", {
        message: "Not a lot creator",
      });

    if (lotData.isConfirmationEmailSent)
      throw new AppClientError(
        "Need to cancel previous confirmation email first."
      );

    if (lotData.isConfirmationSigned)
      throw new AppClientError("Already confirmed");

    const chainLotData = await viemClient.readContract({
      abi: auctionContractAbi,
      address: getEnvConfigServer()
        .NEXT_PUBLIC_AUCTION_CONTRACT_ADDRESS as `0x${string}`,
      functionName: "getLotData",
      args: [stringToBytes32(session.session.userId)],
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
      data: { isConfirmationSigned: false, isConfirmationEmailSent: true },
    });

    await sendEmail({
      to: session.user.email,
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
