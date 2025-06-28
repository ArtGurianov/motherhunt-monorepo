"use client";

import { ChangeEmailForm } from "@/components/Forms/ChangeEmailForm";
import { InfoCard } from "@/components/InfoCard/InfoCard";
import { authClient } from "@/lib/auth/authClient";
import { redirect } from "next/navigation";

export const EmailInfo = () => {
  const { isPending, data } = authClient.useSession();
  if (isPending) return "loading...";
  if (!data) redirect("/signin");

  return (
    <InfoCard title="email">
      <ChangeEmailForm currentEmail={data.user.email} />
    </InfoCard>
  );
};
