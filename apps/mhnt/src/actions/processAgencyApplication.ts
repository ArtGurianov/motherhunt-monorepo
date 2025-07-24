"use server";

import auth from "@/lib/auth/auth";
import { prismaClient } from "@/lib/db";
import { getAppLocale, getAppURL } from "@shared/ui/lib/utils";
import { headers } from "next/headers";
import { sendEmail } from "./sendEmail";
import { OrganizationAfterReviewMetadata } from "@/lib/utils/types";
import { APIError } from "@/lib/auth/apiError";
import { getTranslations } from "next-intl/server";
import { viemClient } from "@/lib/web3/viemClient";

const locale = getAppLocale();

export const processAgencyApplication = async ({
  address,
  signature,
  organizationId,
  rejectionReason,
  headBookerEmail,
}: {
  address: string;
  signature: string;
  organizationId: string;
  rejectionReason?: string;
  headBookerEmail: string;
}) => {
  const isValidSignature = await viemClient.verifyMessage({
    address: address as `0x${string}`,
    message: "Process agency application",
    signature: signature as `0x${string}`,
  });
  if (!isValidSignature)
    throw new APIError("FORBIDDEN", {
      message: "Invalid signature",
    });

  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });
  if (!session) {
    throw new APIError("UNAUTHORIZED", { message: "Unauthorized" });
  }

  const updateMetadata: OrganizationAfterReviewMetadata = rejectionReason
    ? {
        reviewerAddress: address,
        rejectionReason,
      }
    : {
        reviewerAddress: address,
      };

  await prismaClient.organization.update({
    where: { id: organizationId },
    data: {
      metadata: JSON.stringify(updateMetadata),
    },
  });

  const t = await getTranslations({ locale, namespace: "EMAIL" });

  await sendEmail({
    to: headBookerEmail,
    subject: rejectionReason
      ? t("agency-rejected-subject")
      : t("agency-accepted-subject"),
    meta: {
      description: rejectionReason
        ? t("agency-rejected-description")
        : t("agency-accepted-description"),
      link: `${getAppURL(locale)}/sign-in`,
    },
  });
};
