"use server";

import { auth } from "@/lib/auth/auth";
import { AGENCY_ENTITIES } from "@/lib/auth/permissions/agency-permissions";
import { prismaClient } from "@/lib/db";
import { getAppLocale, getAppURL } from "@shared/ui/lib/utils";
import { headers } from "next/headers";
import { sendEmail } from "./sendEmail";
import { OrganizationAfterReviewMetadata } from "@/lib/utils/types";
import { APIError } from "@/lib/auth/apiError";
import { getTranslations } from "next-intl/server";

const locale = getAppLocale();

export const processAgencyApplication = async ({
  organizationId,
  rejectionReason,
  headBookerEmail,
}: {
  organizationId: string;
  rejectionReason?: string;
  headBookerEmail: string;
}) => {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });
  if (!session) {
    throw new APIError("UNAUTHORIZED", { message: "Unauthorized" });
  }
  const permissionResult = await auth.api.userHasPermission({
    headers: headersList,
    body: {
      userId: session.user.id,
      permissions: {
        [AGENCY_ENTITIES.AGENCY_ORGANIZATION]: ["create"],
        [AGENCY_ENTITIES.AGENCY_HEAD_BOOKER]: ["create"],
      },
    },
  });
  if (!permissionResult.success) {
    throw new APIError("FORBIDDEN", { message: "Permission Denied" });
  }

  const updateMetadata: OrganizationAfterReviewMetadata = rejectionReason
    ? {
        reviewerId: session.user.id,
        rejectionReason,
      }
    : {
        reviewerId: session.user.id,
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
      link: `${getAppURL(locale)}/signin`,
    },
  });
};
