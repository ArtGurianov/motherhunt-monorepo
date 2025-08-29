"use server";

import { Session } from "better-auth";
import { APIError } from "better-auth/api";
import { prismaClient } from "@/lib/db";
import { getMemberRole } from "@/actions/getMemberRole";
import { getSessionFromDB } from "@/actions/getSessionFromDB";
import {
  APPLICATION_STATUSES,
  ApplicationStatus,
  getAgencyApplicationStatus,
} from "@/lib/utils/getAgencyApplicationStatus";
import { ORG_TYPES, OrgMetadata, OrgType } from "@/lib/utils/types";

export const sessionBeforeUpdate = async (
  updateSessionData: Partial<Session>
): Promise<
  | boolean
  | void
  | {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      data: Session & Record<string, any>;
    }
> => {
  if (
    Object.keys(updateSessionData).length === 2 &&
    "expiresAt" in updateSessionData &&
    "updatedAt" in updateSessionData
  ) {
    return true;
  }

  if (!("activeOrganizationId" in updateSessionData)) {
    return true;
  }

  const result = await getSessionFromDB();

  if (!result.success) {
    throw new APIError("INTERNAL_SERVER_ERROR", {
      message: result.errorMessage,
    });
  }
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const { userId, id, ...oldSession } = result.data!;

  const updateActiveOrganizationId = (
    updateSessionData as unknown as {
      activeOrganizationId: string | null;
    }
  ).activeOrganizationId;

  const shouldUpdateActiveOrganization =
    (!!oldSession.activeOrganizationId || !!updateActiveOrganizationId) &&
    oldSession.activeOrganizationId !== updateActiveOrganizationId;

  if (!shouldUpdateActiveOrganization) {
    return true;
  }

  let updateOrganizationName: string | null = null;
  let updateOrganizationType: OrgType | null = null;
  let membership: { role: string; memberId: string } | null = null;
  let applicationStatus: ApplicationStatus | null = null;

  if (updateActiveOrganizationId) {
    const organization = await prismaClient.organization.findFirst({
      where: { id: updateActiveOrganizationId },
    });
    if (!organization?.metadata)
      throw new APIError("NOT_FOUND", {
        message: "Organization data Not Found",
      });

    const metadata = JSON.parse(organization.metadata) as OrgMetadata;
    updateOrganizationType = metadata.orgType;

    applicationStatus = getAgencyApplicationStatus(organization).status;
    updateOrganizationName = organization.name;
    const result = await getMemberRole({
      userId,
      organizationId: organization.id,
    });
    if (result.success) {
      membership = result.data;
    }
  }

  await prismaClient.user.update({
    where: { id: userId },
    data: {
      recentOrganizationId:
        updateActiveOrganizationId &&
        (updateOrganizationType === ORG_TYPES.SCOUTING ||
          applicationStatus === APPLICATION_STATUSES.APPROVED)
          ? updateActiveOrganizationId
          : null,
      recentOrganizationName: updateOrganizationName,
      recentOrganizationType: updateOrganizationType,
    },
  });

  return {
    data: {
      ...oldSession,
      ...updateSessionData,
      ...(!updateActiveOrganizationId ||
      !membership ||
      (updateOrganizationType === ORG_TYPES.AGENCY &&
        applicationStatus !== APPLICATION_STATUSES.APPROVED)
        ? {
            activeOrganizationId: null,
            activeOrganizationRole: null,
            activeOrganizationName: null,
            activeOrganizationType: null,
            activeMemberId: null,
          }
        : {
            activeOrganizationId: updateActiveOrganizationId,
            activeOrganizationName: updateOrganizationName,
            activeOrganizationType: updateOrganizationType,
            activeMemberId: membership.memberId,
            activeOrganizationRole: membership.role,
          }),
    } as Session,
  };
};
