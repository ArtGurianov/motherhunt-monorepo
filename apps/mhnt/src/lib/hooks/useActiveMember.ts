import { useEffect, useState } from "react";
import { authClient } from "../auth/authClient";
import { getDisplayUserRole } from "../auth/displayRoles";
import { OrgType } from "../utils/types";
import { OrgRole } from "../auth/permissions/org-permissions";

export interface ActiveMemberSessionData {
  organizationId: string;
  organizationName: string;
  organizationType: OrgType;
  role: string;
}

export const useActiveMember = () => {
  const { isPending, data: session, error, refetch } = authClient.useSession();
  const [data, setData] = useState<ActiveMemberSessionData | null>(null);

  useEffect(() => {
    const sessionData = session?.session;
    if (!sessionData) {
      setData(null);
      return;
    }
    const {
      activeOrganizationId,
      activeOrganizationName,
      activeOrganizationType,
      activeOrganizationRole,
    } = sessionData;
    setData(
      activeOrganizationId &&
        activeOrganizationName &&
        activeOrganizationType &&
        activeOrganizationRole
        ? {
            organizationId: activeOrganizationId,
            organizationName: activeOrganizationName,
            organizationType: activeOrganizationType as OrgType,
            role: getDisplayUserRole(
              activeOrganizationType as OrgType,
              activeOrganizationRole as OrgRole
            ),
          }
        : null
    );
  }, [session]);

  return {
    data,
    isPending: isPending,
    errorMessage: error?.message,
    refetch,
  };
};
