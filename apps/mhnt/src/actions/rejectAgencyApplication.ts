"use server";

import { prismaClient } from "@/lib/db";
import { getAppLocale, getAppURL } from "@shared/ui/lib/utils";
import { sendEmail } from "./sendEmail";
import { APIError } from "better-auth/api";
import { getTranslations } from "next-intl/server";
import { viemClient } from "@/lib/web3/viemClient";
import { canProcessAgencyApplication } from "@/lib/auth/permissions/checkers";
import { revalidatePath } from "next/cache";
import { createActionResponse } from "@/lib/utils/createActionResponse";
import { AppClientError } from "@shared/ui/lib/utils/appClientError";
import { ORG_TYPES, OrgMetadata } from "@/lib/utils/types";

const locale = getAppLocale();

export const rejectAgencyApplication = async ({
  address,
  signature,
  organizationId,
  rejectionReason,
}: {
  address: string;
  signature: string;
  organizationId: string;
  rejectionReason: string;
}) => {
  try {
    const canAccess = await canProcessAgencyApplication();
    if (!canAccess)
      throw new APIError("FORBIDDEN", { message: "Access Denied" });

    const isValidSignature = await viemClient.verifyMessage({
      address: address as `0x${string}`,
      message: "Reject agency application",
      signature: signature as `0x${string}`,
    });
    if (!isValidSignature)
      throw new APIError("FORBIDDEN", {
        message: "Invalid signature",
      });

    const orgData = await prismaClient.organization.findUnique({
      where: { id: organizationId },
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
      reviewerAddress: address,
      rejectionReason,
    };

    await prismaClient.organization.update({
      where: { id: organizationId },
      data: {
        metadata: JSON.stringify(updateMetadata),
      },
    });

    const t = await getTranslations({ locale, namespace: "EMAIL" });

    await sendEmail({
      to: creator.email,
      subject: t("agency-rejected-subject"),
      meta: {
        description: t("agency-rejected-description"),
        link: `${getAppURL(locale)}/sign-in`,
      },
    });

    revalidatePath("/admin/cases/agencies");
    revalidatePath("/@modal/(.)settings/switch-account/agency/requests");
    revalidatePath("/@modal/settings/switch-account/agency/requests");

    return createActionResponse();
  } catch (error) {
    return createActionResponse({ error });
  }
};
