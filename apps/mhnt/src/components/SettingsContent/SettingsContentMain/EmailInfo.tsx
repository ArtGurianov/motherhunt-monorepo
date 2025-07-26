"use client";

import { changeUserToggleState } from "@/actions/changeUserToggleState";
import { ChangeEmailForm } from "@/components/Forms/ChangeEmailForm";
import { InfoCard } from "@/components/InfoCard/InfoCard";
import { ToggleStateField } from "@/components/ToggleStateField/ToggleStateField";
import { authClient } from "@/lib/auth/authClient";
import { redirect } from "next/navigation";
import { toast } from "@shared/ui/components/sonner";
import { useTranslations } from "next-intl";

export const EmailInfo = () => {
  const { isPending, data, refetch } = authClient.useSession();
  const t = useTranslations("TOGGLE_LABELS");
  const tCommon = useTranslations("COMMON");
  const tTitles = useTranslations("INFO_CARD_TITLES");
  const tToasts = useTranslations("TOASTS");

  if (isPending) return tCommon("loading");
  if (!data) redirect("/sign-in");

  return (
    <InfoCard title={tTitles("email")}>
      <ChangeEmailForm currentEmail={data.user.email} />
      <ToggleStateField
        label={t("system-notifications")}
        currentValue={data.user.isSystemEmailsEnabled}
        onToggle={async () => {
          const result = await changeUserToggleState(
            "isSystemEmailsEnabled",
            !data.user.isSystemEmailsEnabled
          );
          if (result.errorMessage) {
            toast(result.errorMessage);
          } else {
            toast(tToasts("UPDATED"));
            refetch();
          }
        }}
      />
      <ToggleStateField
        label={t("newsletter")}
        currentValue={data.user.isNewsletterEmailsEnabled}
        onToggle={async () => {
          const result = await changeUserToggleState(
            "isNewsletterEmailsEnabled",
            !data.user.isNewsletterEmailsEnabled
          );
          if (result.errorMessage) {
            toast(result.errorMessage);
          } else {
            toast(tToasts("UPDATED"));
            refetch();
          }
        }}
      />
    </InfoCard>
  );
};
