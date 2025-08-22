import { authClient } from "../auth/authClient";
import { getCustomMemberRole } from "../auth/customRoles";
import { OrgRole } from "../auth/permissions/org-permissions";
import { OrgType } from "../utils/types";

export interface ActiveMemberSessionData {
  organizationId: string;
  organizationName: string;
  organizationType: OrgType;
  role: string;
}

export const useActiveMember = () => {
  const { isPending, data: session, error, refetch } = authClient.useSession();

  let data: ActiveMemberSessionData | null = null;
  if (!session) {
    data = null;
  } else {
    const {
      activeOrganizationId,
      activeOrganizationName,
      activeOrganizationType,
      activeOrganizationRole,
    } = session.session;
    data = Boolean(
      activeOrganizationId &&
        activeOrganizationName &&
        activeOrganizationType &&
        activeOrganizationRole
    )
      ? {
          organizationId: activeOrganizationId!,
          organizationName: activeOrganizationName!,
          organizationType: activeOrganizationType! as OrgType,
          role: getCustomMemberRole(
            activeOrganizationType! as OrgType,
            activeOrganizationRole! as OrgRole
          ),
        }
      : null;
  }

  return {
    data,
    isPending,
    errorMessage: error?.message,
    refetch,
  };
};
