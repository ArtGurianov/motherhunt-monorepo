import { RoleGuardClient } from "@/components/Guards/RoleGuardClient";
import { APP_ROLES, AppRole } from "@/lib/auth/permissions/app-permissions";
import { ReactNode } from "react";

const ALLOWED_ROLES: AppRole[] = [
  APP_ROLES.PROJECT_SUPERADMIN_ROLE,
  APP_ROLES.PROJECT_ADMIN_ROLE,
];

export default function AdminLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <RoleGuardClient allowedRoles={ALLOWED_ROLES}>{children}</RoleGuardClient>
  );
}
