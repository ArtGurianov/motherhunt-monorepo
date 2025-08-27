import { useAuth } from "@/components/AppProviders/AuthProvider";
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
  const { session, refetch } = useAuth();

  const {
    activeOrganizationId,
    activeOrganizationName,
    activeOrganizationType,
    activeOrganizationRole,
  } = session;

  return {
    refetch,
    data: Boolean(
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
      : null,
  };
};
