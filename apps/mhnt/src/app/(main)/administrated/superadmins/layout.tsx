import { canViewDaog } from "@/lib/auth/permissions/checkers";
import { ReactNode } from "react";
import { StatusCard, StatusCardTypes } from "@shared/ui/components/StatusCard";
import { getTranslations } from "next-intl/server";
import { getAppLocale } from "@shared/ui/lib/utils";

const locale = getAppLocale();

export default async function DaogLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const { canAccess } = await canViewDaog();
  if (!canAccess) {
    const t = await getTranslations({ locale, namespace: "TOASTS" });
    return (
      <StatusCard
        type={StatusCardTypes.ERROR}
        title={t("ACCESS_DENIED")}
        className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
      />
    );
  }

  return children;
}
