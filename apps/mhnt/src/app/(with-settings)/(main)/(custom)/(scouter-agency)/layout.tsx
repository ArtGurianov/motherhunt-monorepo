import { RoleGuardClient } from "@/components/Guards/RoleGuardClient";
import { CUSTOM_MEMBER_ROLES, CustomMemberRole } from "@/lib/auth/customRoles";
import { ReactNode } from "react";

const ALLOWED_ROLES: CustomMemberRole[] = [
  CUSTOM_MEMBER_ROLES.SCOUTER_ROLE,
  CUSTOM_MEMBER_ROLES.HEADBOOKER_ROLE,
  CUSTOM_MEMBER_ROLES.BOOKER_ROLE,
];

export default function ScouterAndAgencyLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <RoleGuardClient allowedRoles={ALLOWED_ROLES}>{children}</RoleGuardClient>
  );
}
