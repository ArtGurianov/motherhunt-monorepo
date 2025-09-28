"use client";

import { changeUserToggleState } from "@/actions/changeUserToggleState";
import { ChangeEmailForm } from "@/components/Forms";
import { InfoCard } from "@/components/InfoCard/InfoCard";
import { ToggleStateField } from "@/components/ToggleStateField/ToggleStateField";
import { useAuthenticated } from "@/lib/hooks";
import { toast } from "@shared/ui/components/sonner";
import { useTranslations } from "next-intl";

export const EmailInfo = () => {
  const { user } = useAuthenticated();

  const t = useTranslations("TOGGLE_LABELS");
  const tTitles = useTranslations("INFO_CARD_TITLES");
  const tToasts = useTranslations("TOASTS");

  return (
    <InfoCard title={tTitles("email")}>
      <ChangeEmailForm currentEmail={user.email} />
      <ToggleStateField
        label={t("system-notifications")}
        currentValue={user.isSystemEmailsEnabled}
        onToggle={async () => {
          const result = await changeUserToggleState(
            "isSystemEmailsEnabled",
            !user.isSystemEmailsEnabled
          );
          if (!result.success) {
            toast(result.errorMessage);
            return;
          }
          toast(tToasts("UPDATED"));
        }}
      />
      <ToggleStateField
        label={t("newsletter")}
        currentValue={user.isNewsletterEmailsEnabled}
        onToggle={async () => {
          const result = await changeUserToggleState(
            "isNewsletterEmailsEnabled",
            !user.isNewsletterEmailsEnabled
          );
          if (!result.success) {
            toast(result.errorMessage);
            return;
          }
          toast(tToasts("UPDATED"));
        }}
      />
    </InfoCard>
  );
};
