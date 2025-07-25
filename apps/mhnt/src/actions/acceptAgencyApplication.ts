"use server";

import { APIError } from "@/lib/auth/apiError";
import { canProcessAgencyApplication } from "@/lib/auth/permissions/checkers";
import { prismaClient } from "@/lib/db";
import { OrganizationAfterReviewMetadata } from "@/lib/utils/types";
import { systemContractAbi } from "@/lib/web3/abi";
import { viemClient } from "@/lib/web3/viemClient";
import { revalidatePath } from "next/cache";
import { hexToString, parseEventLogs } from "viem";
import { getTransactionReceipt } from "viem/actions";

export const acceptAgencyApplication = async (txHash: `0x${string}`) => {
  const canAccess = await canProcessAgencyApplication();
  if (!canAccess) throw new APIError("FORBIDDEN", { message: "Access Denied" });

  const receipt = await getTransactionReceipt(viemClient, {
    hash: txHash,
  });

  const eventLogs = parseEventLogs({
    abi: systemContractAbi,
    logs: receipt.logs,
    eventName: "WhitelistedAgency",
  });

  if (!eventLogs.length)
    throw new APIError("NOT_FOUND", { message: "Logs not present" });

  const updateMetadata: OrganizationAfterReviewMetadata = {
    reviewerAddress: eventLogs[0]!.args._whitelistedBy,
  };

  await prismaClient.organization.update({
    where: { id: hexToString(eventLogs[0]!.args._agencyId, { size: 32 }) },
    data: {
      metadata: JSON.stringify(updateMetadata),
    },
  });

  revalidatePath("/admin/cases/agencies");
  revalidatePath("/@modal/(.)settings/agency");
  revalidatePath("/@modal/settings/agency");
  revalidatePath("/@modal/(.)settings/agency/requests");
  revalidatePath("/@modal/settings/agency/requests");
};
