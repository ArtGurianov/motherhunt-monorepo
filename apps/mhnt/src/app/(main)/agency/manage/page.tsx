import { canViewHeadBooker } from "@/lib/auth/permissions/checkers";
import { ManageBookers } from "./_widgets/ManageBookers";
import { StatusCard, StatusCardTypes } from "@shared/ui/components/StatusCard";
import { getTranslations } from "next-intl/server";
import { getAppLocale } from "@shared/ui/lib/utils";

const locale = getAppLocale();

export default async function AgencyManagePage() {
  const canAccess = await canViewHeadBooker();
  if (!canAccess) {
    const t = await getTranslations({ locale, namespace: "TOASTS" });
    return (
      <StatusCard type={StatusCardTypes.ERROR} title={t("ACCESS_DENIED")} />
    );
  }

  return (
    <>
      <ManageBookers />
    </>
  );
}
