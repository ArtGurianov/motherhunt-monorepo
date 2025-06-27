"use client";

import { InfoCard } from "@/components/InfoCard/InfoCard";
import { authClient } from "@/lib/auth/authClient";
import { Button } from "@shared/ui/components/button";
import {
  InlineData,
  InlineDataContent,
  InlineDataLabel,
} from "@shared/ui/components/InlineData";
import { redirect } from "next/navigation";

export const AuthInfo = () => {
  const session = authClient.useSession();
  if (!session) redirect("/signin");

  return (
    <InfoCard title="account">
      <InlineData>
        <InlineDataLabel>{"Currently logged in as:"}</InlineDataLabel>
        <InlineDataContent className="relative">
          {session.data?.user.role}
          <span className="font-bold absolute right-0 top-0 bg-main/30 border-l h-full flex justify-center items-center px-4 font-mono text-sm">
            {"ACTIVE"}
          </span>
        </InlineDataContent>
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
