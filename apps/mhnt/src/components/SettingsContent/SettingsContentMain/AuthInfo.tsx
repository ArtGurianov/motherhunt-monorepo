"use client";

import { InfoCard } from "@/components/InfoCard/InfoCard";
import { authClient } from "@/lib/auth/authClient";
import { Button } from "@shared/ui/components/button";
import { InlineData } from "@shared/ui/components/InlineData";
import { redirect } from "next/navigation";

export const AuthInfo = () => {
  const session = authClient.useSession();
  if (!session) redirect("/signin");

  return (
    <InfoCard title="account">
      <InlineData label="Currently logged in as:">
        {session.data?.user.role}
      </InlineData>
      <div className="w-full flex gap-4 items-center px-1">
        <span className="text-sm font-bold text-end">{"Switch to:"}</span>
        <Button size="sm" variant="secondary">
          {"Scouter"}
        </Button>
        <span className="text-sm font-bold">{"or"}</span>
        <Button size="sm" variant="secondary">
          {"Agency"}
        </Button>
      </div>
    </InfoCard>
  );
};
