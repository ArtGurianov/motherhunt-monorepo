import { getCustomMemberRole } from "../auth/customRoles";
import { OrgRole } from "../auth/permissions/org-permissions";
import { OrgType } from "../utils/types";
import { useSession } from "./useSession";

export const useAuth = () => {
  const query = useSession();
  const { data } = query;

  return {
    ...query,
    session: data?.session ?? null,
    user: data?.user ?? null,
    activeMember:
      !!data?.session.activeOrganizationId &&
      !!data?.session.activeOrganizationName &&
      !!data?.session.activeOrganizationType &&
      !!data?.session.activeOrganizationRole
        ? {
            organizationId: data?.session.activeOrganizationId,
            organizationName: data?.session.activeOrganizationName,
            organizationType: data?.session.activeOrganizationType as OrgType,
            role: getCustomMemberRole(
              data?.session.activeOrganizationType as OrgType,
              data?.session.activeOrganizationRole as OrgRole,
            ),
          }
        : null,
  };
};
