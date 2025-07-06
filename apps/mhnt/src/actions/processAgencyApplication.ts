"use server";

import { auth } from "@/lib/auth/auth";
import { AGENCY_ENTITIES } from "@/lib/auth/permissions/agency-permissions";
import { prismaClient } from "@/lib/db";
import { getAppURL } from "@shared/ui/lib/utils";
import { headers } from "next/headers";
import { sendEmail } from "./sendEmail";
import { OrganizationAfterReviewMetadata } from "@/lib/utils/types";
import { APIError } from "@/lib/auth/apiError";

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

  await sendEmail({
    to: headBookerEmail,
    subject: rejectionReason ? "Agency Rejected" : "Agency Accepted",
    meta: {
      description: rejectionReason
        ? `Your request for setting up an organization was rejected. Reason: ${rejectionReason}`
        : "Congratulations! Your agency is now setup! Sign in now and start booking models!",
      link: `${getAppURL()}/signin`,
    },
  });
};
