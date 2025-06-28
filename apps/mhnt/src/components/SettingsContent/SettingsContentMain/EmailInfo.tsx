"use client";

import { changeUserToggleState } from "@/actions/changeUserToggleState";
import { ChangeEmailForm } from "@/components/Forms/ChangeEmailForm";
import { InfoCard } from "@/components/InfoCard/InfoCard";
import { ToggleStateField } from "@/components/ToggleStateField/ToggleStateField";
import { authClient } from "@/lib/auth/authClient";
import { redirect } from "next/navigation";

export const EmailInfo = () => {
  const { isPending, data, refetch } = authClient.useSession();
  if (isPending) return "loading...";
  if (!data) redirect("/signin");

  return (
    <InfoCard title="email">
      <ChangeEmailForm currentEmail={data.user.email} />
      <ToggleStateField
        label="Subscribe to system notifications:"
        currentValue={data.user.isSystemEmailsEnabled}
        onToggle={async () => {
          await changeUserToggleState(
            "isSystemEmailsEnabled",
            !data.user.isSystemEmailsEnabled
          );
          refetch();
        }}
      />
      <ToggleStateField
        label="Subscribe to newsletter:"
        currentValue={data.user.isNewsletterEmailsEnabled}
        onToggle={async () => {
          await changeUserToggleState(
            "isNewsletterEmailsEnabled",
            !data.user.isNewsletterEmailsEnabled
          );
          refetch();
        }}
      />
    </InfoCard>
  );
};
