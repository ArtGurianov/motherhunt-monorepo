"use server";

import { APIError } from "better-auth/api";
import { prismaClient } from "@/lib/db";
import { createActionResponse } from "@/lib/utils/createActionResponse";
import { ORG_TYPES, OrgMetadata } from "@/lib/utils/types";
import { systemContractAbi } from "@/lib/web3/abi";
import { viemClient } from "@/lib/web3/viemClient";
import { AppClientError } from "@shared/ui/lib/utils/appClientError";
import { revalidatePath } from "next/cache";
import { hexToString, parseEventLogs } from "viem";
import { getTransactionReceipt } from "viem/actions";
import { getTranslations } from "next-intl/server";
import { getAppLocale, getAppURL } from "@shared/ui/lib/utils";
import { sendEmail } from "./sendEmail";
import { canAccessAppRole } from "@/lib/auth/permissions/checkers";
import { APP_ENTITIES } from "@/lib/auth/permissions/app-permissions";

const locale = getAppLocale();

export const acceptAgencyApplication = async (txHash: `0x${string}`) => {
  try {
    const canAccess = await canAccessAppRole(
      APP_ENTITIES.ORGANIZATION,
      "process"
    );
    if (!canAccess)
      throw new APIError("FORBIDDEN", { message: "Access Denied" });

    const receipt = await getTransactionReceipt(viemClient, {
      hash: txHash,
    });

    const eventLogs = parseEventLogs({
      abi: systemContractAbi,
      logs: receipt.logs,
      eventName: "WhitelistedAgency",
    });

    if (!eventLogs.length) throw new AppClientError("Logs not present");

    const orgData = await prismaClient.organization.findUnique({
      where: { id: hexToString(eventLogs[0]!.args._agencyId, { size: 32 }) },
    });

    if (!orgData?.metadata)
      throw new AppClientError("Organization data not present");

    const metadata = JSON.parse(orgData.metadata) as OrgMetadata;

    if (metadata.orgType !== ORG_TYPES.AGENCY)
      throw new AppClientError("Not an agency organization");

    const creator = await prismaClient.user.findUnique({
      where: { id: metadata.creatorUserId },
    });

    if (!creator) {
      throw new AppClientError("Creator not found");
    }

    if (creator.banned) {
      throw new AppClientError("Banned");
    }

    const updateMetadata = {
      ...metadata,
      reviewerAddress: eventLogs[0]!.args._whitelistedBy,
    };

    await prismaClient.organization.update({
      where: { id: orgData.id },
      data: {
        metadata: JSON.stringify(updateMetadata),
      },
    });

    const t = await getTranslations({ locale, namespace: "EMAIL" });

    await sendEmail({
      to: creator.email,
      subject: t("agency-accepted-subject"),
      meta: {
        description: t("agency-accepted-description"),
        link: `${getAppURL(locale)}/sign-in`,
      },
    });

    revalidatePath("/admin/cases/agencies");
    revalidatePath("/@modal/(.)settings/switch-account/agency");
    revalidatePath("/@modal/settings/switch-account/agency");
    revalidatePath("/@modal/(.)settings/switch-account/agency/requests");
    revalidatePath("/@modal/settings/switch-account/agency/requests");

    return createActionResponse();
  } catch (error) {
    return createActionResponse({ error });
  }
};
