"use client";

import { CaptureBtn } from "@/components/CaptureBtn";
import { InfoCard } from "@/components/InfoCard/InfoCard";
import { authClient } from "@/lib/auth/authClient";
import {
  InlineData,
  InlineDataContent,
  InlineDataLabel,
} from "@shared/ui/components/InlineData";
import Link from "next/link";
import { redirect } from "next/navigation";

export const AuthInfo = () => {
  const { isPending, data } = authClient.useSession();
  if (isPending) return "loading...";
  if (!data) redirect("/signin");

  return (
    <InfoCard title="account">
      <InlineData>
        <InlineDataLabel>{"Currently logged in as:"}</InlineDataLabel>
        <InlineDataContent className="relative">
          {data.user.role}
          <span className="font-bold absolute right-0 top-0 bg-main/30 border-l h-full flex justify-center items-center px-4 font-mono text-sm text-green-500 border-border">
            {"ACTIVE"}
          </span>
        </InlineDataContent>
      </InlineData>
      <div className="relative w-full h-10">
        <div className="absolute z-0 top-0 left-1/2 -translate-x-1/2 h-full flex gap-2 items-center px-1">
          <span className="text-sm font-bold text-end text-nowrap">
            {"Switch to:"}
          </span>
          <CaptureBtn shape="horizontal">{"SCOUTER"}</CaptureBtn>
          <span className="text-sm font-bold">{"or"}</span>
          <CaptureBtn shape="horizontal">
            <Link href="/settings/agency">{"AGENCY"}</Link>
          </CaptureBtn>
        </div>
      </div>
    </InfoCard>
  );
};
