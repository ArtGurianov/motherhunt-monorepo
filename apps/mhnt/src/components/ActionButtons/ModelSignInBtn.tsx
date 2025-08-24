"use client";

import { authClient } from "@/lib/auth/authClient";
import { useActiveMember } from "@/lib/hooks";
import { Button } from "@shared/ui/components/button";
import { GetComponentProps } from "@shared/ui/lib/types";
import { Suspense, useTransition } from "react";
import { InterceptedLink } from "../InterceptedLink/InterceptedLink";
import { CUSTOM_MEMBER_ROLES } from "@/lib/auth/customRoles";
import { toast } from "@shared/ui/components/sonner";
import { AppClientError } from "@shared/ui/lib/utils/appClientError";
import Link from "next/link";

export const ModelSignInBtn = (props: GetComponentProps<typeof Button>) => {
  const [isTransitionPending, startTransition] = useTransition();

  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const {
    data: activeMember,
    isPending: isActiveMemberPending,
    refetch: refetchActiveMember,
  } = useActiveMember();

  if (isSessionPending || isActiveMemberPending)
    return <Button {...props}>{"loading..."}</Button>;

  if (!session)
    return (
      <Suspense>
        <Button {...props} asChild disabled>
          <InterceptedLink href="/sign-in">{"MODEL"}</InterceptedLink>
        </Button>
      </Suspense>
    );

  if (!session.user.modelSocialId || !session.user.modelOrganizationId) {
    return (
      <Button asChild>
        <Link href="/settings/switch-account/model">{"MODEL"}</Link>
      </Button>
    );
  }

  return (
    <Button
      disabled={activeMember?.role === CUSTOM_MEMBER_ROLES.MODEL_ROLE}
      onClick={() => {
        startTransition(async () => {
          try {
            await authClient.organization.setActive({
              organizationId: session.user.modelOrganizationId,
            });
            refetchActiveMember();
            toast("Switched to Model");
          } catch (error) {
            if (error instanceof AppClientError) {
              toast(error.message);
            } else {
              toast("Unexpected Error");
            }
          }
        });
      }}
    >
      {isTransitionPending ? "Signing in..." : "MODEL"}
    </Button>
  );
};
