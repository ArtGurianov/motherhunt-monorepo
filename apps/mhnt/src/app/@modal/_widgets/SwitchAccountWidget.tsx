"use client";

import { Button } from "@shared/ui/components/button";
import { toast } from "@shared/ui/components/sonner";
import { AppClientError } from "@shared/ui/lib/utils/appClientError";
import { LoaderCircle } from "lucide-react";
import { authClient } from "@/lib/auth/authClient";
import { useActiveMember } from "@/lib/hooks/useActiveMember";
import { Suspense, useTransition } from "react";
import Link from "next/link";
import { InterceptedLink } from "@/components/InterceptedLink/InterceptedLink";

export const SwitchAccountWidget = () => {
  const [isPending, startTransition] = useTransition();

  const { data: session } = authClient.useSession();

  const {
    isPending: isActiveMemberPending,
    data: activeMember,
    refetch: refetchActiveMember,
  } = useActiveMember();

  return (
    <>
      {activeMember ? (
        <div>
          <h4>{`Currently logged in as ${activeMember?.role}`}</h4>
          <span>{"Switch to:"}</span>
        </div>
      ) : (
        <h4>{"Choose Account Type:"}</h4>
      )}
      <div className="flex flex-col gap-4 w-full h-full justify-center items-stretch px-8">
        <Button
          disabled={
            !session ||
            isActiveMemberPending ||
            activeMember?.organizationId === session.user.scoutingOrganizationId
          }
          onClick={() => {
            startTransition(async () => {
              try {
                await authClient.organization.setActive({
                  organizationId: session?.user.scoutingOrganizationId,
                });
                refetchActiveMember();
                toast("switched to scouter");
              } catch (error) {
                if (error instanceof AppClientError) {
                  toast(error.message);
                } else {
                  toast("unexpected error");
                }
              }
            });
          }}
        >
          {isPending || isActiveMemberPending ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            "SCOUTER"
          )}
        </Button>
        <Suspense>
          <Button asChild disabled={!session || isActiveMemberPending}>
            <InterceptedLink href="/settings/switch-account/agency">
              {"AGENCY"}
            </InterceptedLink>
          </Button>
        </Suspense>
        <Suspense>
          <Button asChild disabled={!session || isActiveMemberPending}>
            <InterceptedLink href="/settings/switch-account/model">
              {"MODEL"}
            </InterceptedLink>
          </Button>
        </Suspense>
      </div>
    </>
  );
};
