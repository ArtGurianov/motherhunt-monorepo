import { canViewAdmin } from "@/lib/auth/permissions/checkers";
import { ReactNode } from "react";
import { StatusCard, StatusCardTypes } from "@shared/ui/components/StatusCard";
import { getTranslations } from "next-intl/server";
import { getAppLocale } from "@shared/ui/lib/utils";

const locale = getAppLocale();

export default async function AdminLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const canView = await canViewAdmin();
  if (!canView) {
    const t = await getTranslations({ locale, namespace: "TOASTS" });
    return (
      <StatusCard type={StatusCardTypes.ERROR} title={t("ACCESS_DENIED")} />
    );
  }

  return children;
}
