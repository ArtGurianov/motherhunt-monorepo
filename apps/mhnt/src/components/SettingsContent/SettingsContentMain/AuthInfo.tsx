"use client";

import { CaptureBtn } from "@/components/CaptureBtn";
import { InfoCard } from "@/components/InfoCard/InfoCard";
import { authClient } from "@/lib/auth/authClient";
import { APP_ROLES } from "@/lib/auth/permissions/app-permissions";
import {
  InlineData,
  InlineDataContent,
  InlineDataLabel,
} from "@shared/ui/components/InlineData";
import { toast } from "@shared/ui/components/sonner";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useTransition } from "react";

export const AuthInfo = () => {
  const [isPending, startTransition] = useTransition();

  const { isPending: isSessionPending, data: session } =
    authClient.useSession();
  if (isSessionPending) return "loading...";
  if (!session) redirect("/signin");

  const {
    isPending: isActiveMemberPending,
    data: activeMember,
    refetch: refetchActiveMember,
  } = authClient.useActiveMember();

  return (
    <InfoCard title="account">
      <InlineData>
        <InlineDataLabel>{"Currently logged in as:"}</InlineDataLabel>
        <InlineDataContent className="relative">
          {isActiveMemberPending ? (
            <LoaderCircle className="animate-spin h-6 w-6" />
          ) : activeMember ? (
            activeMember.role
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
            {activeMember ? (
              <>
                <CaptureBtn
                  shape="horizontal"
                  onClick={() => {
                    startTransition(async () => {
                      try {
                        await authClient.organization.setActive({
                          organizationId: null,
                        });
                        refetchActiveMember();
                        toast("Switched to scouter");
                      } catch {}
                    });
                  }}
                >
                  {isPending ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    "SCOUTER"
                  )}
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
