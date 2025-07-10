import { canViewAdmin } from "@/lib/auth/permissions/checkers";
import { ReactNode } from "react";
import { StatusCard, StatusCardTypes } from "@shared/ui/components/StatusCard";

export default async function AdminLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const canView = await canViewAdmin();
  if (!canView)
    return <StatusCard type={StatusCardTypes.ERROR} title="Access Denied" />;

  return children;
}
