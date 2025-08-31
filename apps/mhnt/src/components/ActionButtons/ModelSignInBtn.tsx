"use client";

import { authClient } from "@/lib/auth/authClient";
import { Button } from "@shared/ui/components/button";
import { GetComponentProps } from "@shared/ui/lib/types";
import { useTransition } from "react";
import { toast } from "@shared/ui/components/sonner";
import Link from "next/link";
import { useAuth } from "../AppProviders/AuthProvider";
import { APP_ROUTES, APP_ROUTES_CONFIG } from "@/lib/routes/routes";
import { formatErrorMessage } from "@/lib/utils/createActionResponse";

export const ModelSignInBtn = (props: GetComponentProps<typeof Button>) => {
  const { user, refetch } = useAuth();

  const [isTransitionPending, startTransition] = useTransition();

  if (!user.modelSocialId || !user.modelOrganizationId) {
    return (
      <Button asChild {...props}>
        <Link href={APP_ROUTES_CONFIG[APP_ROUTES.MODAL_SWITCH_MODEL].href}>
          {"MODEL"}
        </Link>
      </Button>
    );
  }

  return (
    <Button
      {...props}
      onClick={() => {
        startTransition(async () => {
          try {
            await authClient.organization.setActive({
              organizationId: user.modelOrganizationId,
            });
            refetch();
            toast("Switched to Model");
          } catch (error) {
            toast(formatErrorMessage(error));
          }
        });
      }}
    >
      {isTransitionPending ? "Signing in..." : "MODEL"}
    </Button>
  );
};
