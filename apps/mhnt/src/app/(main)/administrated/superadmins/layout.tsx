import { RoleGuardClient } from "@/components/Guards/RoleGuardClient";
import { APP_ROLES, AppRole } from "@/lib/auth/permissions/app-permissions";
import { ReactNode } from "react";

const ALLOWED_ROLES: AppRole[] = [APP_ROLES.MYDAOGS_ADMIN_ROLE];

export default async function DaogLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <RoleGuardClient allowedRoles={ALLOWED_ROLES}>{children}</RoleGuardClient>
  );
}
