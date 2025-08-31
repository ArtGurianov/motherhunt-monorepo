"use client";

import { authClient } from "@/lib/auth/authClient";
import { Session, User } from "@shared/db";
import { Button } from "@shared/ui/components/button";
import { StatusCard, StatusCardTypes } from "@shared/ui/components/StatusCard";
import { AppClientError } from "@shared/ui/lib/utils/appClientError";
import { createContext, useContext, ReactNode, Suspense, useMemo } from "react";
import { InterceptedLink } from "../InterceptedLink/InterceptedLink";
import { APP_ROUTES, APP_ROUTES_CONFIG } from "@/lib/routes/routes";
import { CustomMemberRole, getCustomMemberRole } from "@/lib/auth/customRoles";
import { OrgType } from "@/lib/utils/types";
import { OrgRole } from "@/lib/auth/permissions/org-permissions";

interface Membership {
  organizationId: string;
  organizationName: string;
  organizationType: OrgType;
  role: CustomMemberRole;
}

type AuthContextValue = {
  session: Session;
  user: User;
  activeMember: Membership | null;
  refetch: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const {
    data: session,
    isPending: isSessionPending,
    refetch,
  } = authClient.useSession();

  const providerValue: AuthContextValue | null = useMemo(() => {
    if (!session) return null;

    const {
      session: {
        activeOrganizationId,
        activeOrganizationName,
        activeOrganizationType,
        activeOrganizationRole,
      },
    } = session;

    return {
      ...session,
      activeMember: Boolean(
        activeOrganizationId &&
          activeOrganizationName &&
          activeOrganizationType &&
          activeOrganizationRole
      )
        ? {
            organizationId: activeOrganizationId,
            organizationName: activeOrganizationName,
            organizationType: activeOrganizationType as OrgType,
            role: getCustomMemberRole(
              activeOrganizationType as OrgType,
              activeOrganizationRole as OrgRole
            ),
          }
        : null,
      refetch,
    } as AuthContextValue;
  }, [session]);

  if (isSessionPending) {
    return (
      <StatusCard
        type={StatusCardTypes.LOADING}
        title={"Loading..."}
        className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
      />
    );
  }

  if (!session || !providerValue) {
    return (
      <StatusCard
        type={StatusCardTypes.ERROR}
        title={"Sign In required"}
        className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
      >
        <Suspense>
          <Button asChild size="lg" type="submit" className="w-full">
            <InterceptedLink href={APP_ROUTES_CONFIG[APP_ROUTES.SIGN_IN].href}>
              {"Sign in"}
            </InterceptedLink>
          </Button>
        </Suspense>
      </StatusCard>
    );
  }

  return (
    <AuthContext.Provider value={providerValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new AppClientError("useAuth must be used within an AuthProvider");
  }

  return context;
}
