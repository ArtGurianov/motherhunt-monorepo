"use client";

import { authClient } from "@/lib/auth/authClient";
import { CustomMemberRole } from "@/lib/auth/customRoles";
import { useActiveMember } from "@/lib/hooks";
import { AppRole } from "@shared/db";
import { StatusCard, StatusCardTypes } from "@shared/ui/components/StatusCard";
import { LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: Array<AppRole | CustomMemberRole>;
}

export const RoleGuardClient = ({ children, allowedRoles }: RoleGuardProps) => {
  const t = useTranslations("TOASTS");

  const { isPending: isSessionPending, data: session } =
    authClient.useSession();
  const { data: membership, isPending: isMembershipPending } =
    useActiveMember();

  if (isSessionPending || isMembershipPending) {
    return (
      <div className="flex w-full h-full justify-center items-center">
        <LoaderCircle className="animate-spin h-12 w-12" />
      </div>
    );
  }

  if (!session) redirect("/sign-in");

  const role: AppRole | CustomMemberRole = membership
    ? (membership.role as CustomMemberRole)
    : (session.user.role as AppRole);

  if (!allowedRoles.includes(role)) {
    return (
      <StatusCard
        type={StatusCardTypes.ERROR}
        title={t("ACCESS_DENIED")}
        className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
      />
    );
  }

  return children;
};
