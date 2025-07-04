"use server";

import { Session } from "better-auth";
import { APIError } from "../apiError";
import { prismaClient } from "@/lib/db";
import { AppClientError } from "@shared/ui/lib/utils/appClientError";
import { getMemberRole } from "@/actions/getMemberRole";
import { getSessionFromDB } from "@/actions/getSessionFromDB";
import {
  APPLICATION_STATUSES,
  ApplicationStatus,
  getAgencyApplicationStatus,
} from "@/lib/utils/getAgencyApplicationStatus";

export const sessionUpdateBefore = async (
  updateSessionData: Partial<Session>
): Promise<
  | boolean
  | void
  | {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      data: Session & Record<string, any>;
    }
> => {
  try {
    const {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      data: { userId, id, ...oldSession },
      errorMessage,
    } = await getSessionFromDB();
    if (errorMessage) throw new APIError("FORBIDDEN");

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
      let updateOrganizationRole: string | null = null;
      let applicationStatus: ApplicationStatus | null = null;

      if (updateActiveOrganizationId) {
        const organization = await prismaClient.organization.findFirst({
          where: { id: updateActiveOrganizationId },
        });
        if (!organization) throw new AppClientError("Organization Not Found");

        applicationStatus = getAgencyApplicationStatus(organization);
        if (applicationStatus === APPLICATION_STATUSES.APPROVED) {
          updateOrganizationName = organization.name;
          updateOrganizationRole = await getMemberRole(userId, organization.id);
          if (!updateOrganizationRole)
            throw new AppClientError("Membership not found");
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
          activeOrganizationId:
            updateActiveOrganizationId &&
            applicationStatus === APPLICATION_STATUSES.APPROVED
              ? updateActiveOrganizationId
              : null,
          activeOrganizationName: updateOrganizationName,
          activeOrganizationRole: updateOrganizationRole,
        },
      };
    }
  } catch {
    throw new APIError("INTERNAL_SERVER_ERROR");
  }

  return true;
};
