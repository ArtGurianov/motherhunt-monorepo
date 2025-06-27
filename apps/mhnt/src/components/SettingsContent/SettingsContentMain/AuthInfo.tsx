"use client";

import { CaptureBtn } from "@/components/CaptureBtn";
import { InfoCard } from "@/components/InfoCard/InfoCard";
import { authClient } from "@/lib/auth/authClient";
import {
  InlineData,
  InlineDataContent,
  InlineDataLabel,
} from "@shared/ui/components/InlineData";

export const AuthInfo = () => {
  const session = authClient.useSession();

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
        <CaptureBtn shape="horizontal" size="sm">
          {"Scouter"}
        </CaptureBtn>
        <span className="text-sm font-bold">{"or"}</span>
        <CaptureBtn shape="horizontal">{"Agency"}</CaptureBtn>
      </div>
    </InfoCard>
  );
};
