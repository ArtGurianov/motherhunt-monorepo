"use client";

import { CustomMemberRole } from "@/lib/auth/customRoles";
import { useActiveMember } from "@/lib/hooks";
import { AppRole } from "@shared/db";
import { StatusCard, StatusCardTypes } from "@shared/ui/components/StatusCard";
import { useTranslations } from "next-intl";
import { ReactNode, Suspense } from "react";
import { useAuth } from "../AppProviders/AuthProvider";
import { Button } from "@shared/ui/components/button";
import { InterceptedLink } from "../InterceptedLink/InterceptedLink";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: Array<AppRole | CustomMemberRole>;
}

export const RoleGuardClient = ({ children, allowedRoles }: RoleGuardProps) => {
  const { user } = useAuth();

  const tToasts = useTranslations("TOASTS");
  const tRoles = useTranslations("ROLES");

  const { data: activeMember } = useActiveMember();

  const role: AppRole | CustomMemberRole = activeMember
    ? (activeMember.role as CustomMemberRole)
    : (user.role as AppRole);

  if (!allowedRoles.includes(role)) {
    const stringifiedRoles = allowedRoles.reduce(
      (temp, next, index) =>
        index === 0 ? tRoles(next) : temp + ", " + tRoles(next),
      ""
    );
    return (
      <StatusCard
        type={StatusCardTypes.ERROR}
        title={tToasts("ACCESS_DENIED")}
        description={`You can access this page as ${stringifiedRoles}. Switch account to continue.`}
        className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
      >
        <Suspense>
          <Button asChild size="lg" type="submit" className="w-full">
            <InterceptedLink href="/settings/switch-account">
              {"Switch account"}
            </InterceptedLink>
          </Button>
        </Suspense>
      </StatusCard>
    );
  }

  return children;
};
