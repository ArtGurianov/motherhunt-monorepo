import { canViewSuperAdmin } from "@/lib/auth/permissions/checkers";
import { ReactNode } from "react";
import { StatusCard, StatusCardTypes } from "@shared/ui/components/StatusCard";

export default async function SuperAdminLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const canView = await canViewSuperAdmin();
  if (!canView)
    return <StatusCard type={StatusCardTypes.ERROR} title="Access Denied" />;

  return children;
}
