import { useEffect, useState } from "react";
import { authClient } from "../auth/authClient";

export interface ActiveMemberSessionData {
  organizationId: string;
  organizationName: string;
  role: string;
}

export const useActiveMember = () => {
  const { isPending, data: session, error, refetch } = authClient.useSession();
  const [data, setData] = useState<ActiveMemberSessionData | null>(null);

  const fetch = () => {
    const sessionData = session?.session;
    if (!sessionData) {
      setData(null);
      return;
    }
    const {
      activeOrganizationId,
      activeOrganizationName,
      activeOrganizationRole,
    } = sessionData;
    setData(
      activeOrganizationId && activeOrganizationName && activeOrganizationRole
        ? {
            organizationId: activeOrganizationId,
            organizationName: activeOrganizationName,
            role: activeOrganizationRole,
          }
        : null
    );
  };

  useEffect(() => {
    fetch();
  }, [session]);

  return {
    data,
    isPending: isPending,
    errorMessage: error?.message,
    refetch,
  };
};
