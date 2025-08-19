"use client";

import { authClient } from "@/lib/auth/authClient";
import { useActiveMember } from "@/lib/hooks/useActiveMember";
import { Button } from "@shared/ui/components/button";
import { toast } from "@shared/ui/components/sonner";
import { AppClientError } from "@shared/ui/lib/utils/appClientError";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";

export default function SwitchAccount() {
  const [isPending, startTransition] = useTransition();

  const { data: session } = authClient.useSession();

  const {
    isPending: isActiveMemberPending,
    data: activeMember,
    refetch: refetchActiveMember,
  } = useActiveMember();

  return (
    <>
      <h4>
        {activeMember ? (
          <div>
            <h4>{`Currently logged in as ${activeMember?.role}`}</h4>
            <span>{"Switch to:"}</span>
          </div>
        ) : (
          <h4>{"Choose Account Type:"}</h4>
        )}
      </h4>
      <div className="flex flex-col gap-2 w-full h-full justify-center items-center">
        <Button
          disabled={
            !session ||
            isActiveMemberPending ||
            activeMember?.organizationId === session.user.scoutingOrganizationId
          }
          size="reset"
          className="p-px [&_svg]:size-6"
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
        <Button asChild>
          <Link href="/settings/switch-account/agency">{"AGENCY"}</Link>
        </Button>
        <Button asChild>
          <Link href="/settings/switch-account/model">{"MODEL"}</Link>
        </Button>
      </div>
    </>
  );
}
