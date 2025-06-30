"use client";

import { CaptureBtn } from "@/components/CaptureBtn";
import { InfoCard } from "@/components/InfoCard/InfoCard";
import { authClient } from "@/lib/auth/authClient";
import {
  AGENCY_ROLES,
  AgencyRole,
} from "@/lib/auth/permissions/agency-permissions";
import { APP_ROLES, AppRole } from "@/lib/auth/permissions/app-permissions";
import {
  InlineData,
  InlineDataContent,
  InlineDataLabel,
} from "@shared/ui/components/InlineData";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const AuthInfo = () => {
  const { isPending: isSessionPending, data: session } =
    authClient.useSession();
  if (isSessionPending) return "loading...";
  if (!session) redirect("/signin");

  const {
    isPending: isMemberPending,
    data: activeMembership,
    refetch: refetchMembership,
  } = authClient.useActiveMember();

  return (
    <InfoCard title="account">
      <InlineData>
        <InlineDataLabel>{"Currently logged in as:"}</InlineDataLabel>
        <InlineDataContent className="relative">
          {isMemberPending ? (
            <LoaderCircle className="animate-spin h-6 w-6" />
          ) : activeMembership ? (
            activeMembership.role
          ) : (
            session.user.role
          )}
          <span className="font-bold absolute right-0 top-0 bg-main/30 border-l h-full flex justify-center items-center px-4 font-mono text-sm text-green-500 border-border">
            {"ACTIVE"}
          </span>
        </InlineDataContent>
      </InlineData>
      {session.user.role !== APP_ROLES.SUPER_ADMIN &&
      session.user.role !== APP_ROLES.ADMIN ? (
        <div className="relative w-full h-10">
          <div className="absolute z-0 top-0 left-1/2 -translate-x-1/2 h-full flex gap-2 items-center px-1">
            <span className="text-sm font-bold text-end text-nowrap">
              {"Switch to:"}
            </span>
            {activeMembership ? (
              <>
                <CaptureBtn
                  shape="horizontal"
                  onClick={async () => {
                    await authClient.organization.setActive({
                      organizationId: null,
                    });
                    await refetchMembership();
                  }}
                >
                  {"SCOUTER"}
                </CaptureBtn>
                <span className="text-sm font-bold">{"or"}</span>
              </>
            ) : null}
            <CaptureBtn shape="horizontal">
              <Link href="/settings/agency">{"AGENCY"}</Link>
            </CaptureBtn>
          </div>
        </div>
      ) : null}
    </InfoCard>
  );
};
