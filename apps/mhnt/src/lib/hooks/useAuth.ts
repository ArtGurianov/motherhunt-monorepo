import { getCustomMemberRole } from "../auth/customRoles";
import { OrgRole } from "../auth/permissions/org-permissions";
import { OrgType } from "../utils/types";
import { useSession } from "./useSession";

export const useAuth = () => {
  const query = useSession();
  const { data: result } = query;

  return {
    ...query,
    session: result?.success ? result.data.session : null,
    user: result?.success ? result.data.user : null,
    activeMember:
      !!result?.success &&
      !!result.data.session.activeOrganizationId &&
      !!result.data.session.activeOrganizationName &&
      !!result.data.session.activeOrganizationType &&
      !!result.data.session.activeOrganizationRole
        ? {
            organizationId: result.data.session.activeOrganizationId,
            organizationName: result.data.session.activeOrganizationName,
            organizationType: result.data.session
              .activeOrganizationType as OrgType,
            role: getCustomMemberRole(
              result.data.session.activeOrganizationType as OrgType,
              result.data.session.activeOrganizationRole as OrgRole
            ),
          }
        : null,
  };
};
