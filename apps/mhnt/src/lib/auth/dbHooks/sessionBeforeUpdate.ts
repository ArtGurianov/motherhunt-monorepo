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
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const result = await getSessionFromDB();

  if (result.errorMessage) {
    throw new APIError("INTERNAL_SERVER_ERROR", {
      message: result.errorMessage,
    });
  }
  const { userId, id, ...oldSession } = result.data!;

  const updateActiveOrganizationId = (
    updateSessionData as unknown as {
      activeOrganizationId: string | null;
    }
  ).activeOrganizationId;

  const shouldUpdateActiveOrganization =
    (!!oldSession.activeOrganizationId || !!updateActiveOrganizationId) &&
    oldSession.activeOrganizationId !== updateActiveOrganizationId;

  if (shouldUpdateActiveOrganization) {
    let updateOrganizationName: string | null = null;
    let membership: { role: string; memberId: string } | null = null;
    let applicationStatus: ApplicationStatus | null = null;

    if (updateActiveOrganizationId) {
      const organization = await prismaClient.organization.findFirst({
        where: { id: updateActiveOrganizationId },
      });
      if (!organization)
        throw new APIError("NOT_FOUND", {
          message: "Organization Not Found",
        });

      applicationStatus = getAgencyApplicationStatus(organization).status;
      if (applicationStatus === APPLICATION_STATUSES.APPROVED) {
        updateOrganizationName = organization.name;
        const result = await getMemberRole({
          userId,
          organizationId: organization.id,
        });
        membership = result.data;
      }
    }

    await prismaClient.user.update({
      where: { id: userId },
      data: {
        recentOrganizationId:
          updateActiveOrganizationId &&
          applicationStatus === APPLICATION_STATUSES.APPROVED
            ? updateActiveOrganizationId
            : null,
        recentOrganizationName: updateOrganizationName,
      },
    });

    return {
      data: {
        ...oldSession,
        ...updateSessionData,
        ...(!updateActiveOrganizationId ||
        !membership ||
        applicationStatus !== APPLICATION_STATUSES.APPROVED
          ? {
              activeOrganizationId: null,
              activeOrganizationRole: null,
              activeOrganizationName: null,
              activeMemberId: null,
            }
          : {
              activeOrganizationId: updateActiveOrganizationId,
              activeOrganizationName: updateOrganizationName,
              activeMemberId: membership.memberId,
              activeOrganizationRole: membership.role,
            }),
      } as Session,
    };
  }
  return true;
};
