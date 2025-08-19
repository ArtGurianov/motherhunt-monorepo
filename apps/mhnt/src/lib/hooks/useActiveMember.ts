import { useEffect, useState } from "react";
import { authClient } from "../auth/authClient";
import { getDisplayUserRole } from "../auth/displayRoles";
import { OrgType } from "../utils/types";
import { OrgRole } from "../auth/permissions/org-permissions";

export interface ActiveMemberSessionData {
  organizationId: string;
  organizationName: string;
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
      activeOrganizationRole,
      activeOrganizationType,
    } = sessionData;
    setData(
      activeOrganizationId &&
        activeOrganizationName &&
        activeOrganizationRole &&
        activeOrganizationType
        ? {
            organizationId: activeOrganizationId,
            organizationName: activeOrganizationName,
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
