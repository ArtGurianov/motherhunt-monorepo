"use server";

import { APIError } from "better-auth/api";
import { prismaClient } from "@/lib/db";
import { createActionResponse } from "@/lib/utils/createActionResponse";
import { ORG_TYPES, OrgMetadata } from "@/lib/utils/types";
import { systemContractAbi } from "@/lib/web3/abi";
import { viemClient } from "@/lib/web3/viemClient";
import { AppBusinessError } from "@/lib/utils/errorUtils";
import { revalidatePath } from "next/cache";
import { hexToString, parseEventLogs } from "viem";
import { getTransactionReceipt } from "viem/actions";
import { getTranslations } from "next-intl/server";
import { getAppLocale, getAppURL } from "@shared/ui/lib/utils";
import { sendEmail } from "./sendEmail";
import { canAccessAppRole } from "@/lib/auth/permissions/checkers";
import { APP_ENTITIES } from "@/lib/auth/permissions/app-permissions";
import { APP_ROUTES, APP_ROUTES_CONFIG } from "@/lib/routes/routes";

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

    if (!eventLogs.length) throw new AppBusinessError("Logs not present", 404);

    const orgData = await prismaClient.organization.findUnique({
      where: { id: hexToString(eventLogs[0]!.args._agencyId, { size: 32 }) },
    });

    if (!orgData?.metadata)
      throw new AppBusinessError("Organization data not present", 404);

    const metadata = JSON.parse(orgData.metadata) as OrgMetadata;

    if (metadata.orgType !== ORG_TYPES.AGENCY)
      throw new AppBusinessError("Not an agency organization", 400);

    const creator = await prismaClient.user.findUnique({
      where: { id: metadata.creatorUserId },
    });

    if (!creator) {
      throw new AppBusinessError("Creator not found", 404);
    }

    if (creator.banned) {
      throw new AppBusinessError("Banned", 400);
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

    revalidatePath(APP_ROUTES_CONFIG[APP_ROUTES.AGENCIES_APPLICATIONS].href);
    revalidatePath(APP_ROUTES_CONFIG[APP_ROUTES.MODAL_SWITCH_AGENCY].href);
    revalidatePath(
      APP_ROUTES_CONFIG[APP_ROUTES.MODAL_SWITCH_AGENCY_REQUESTS].href
    );

    return createActionResponse();
  } catch (error) {
    return createActionResponse({ error });
  }
};
