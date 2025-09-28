"use client";

import { authClient } from "@/lib/auth/authClient";
import { formatErrorMessage } from "@/lib/utils/createActionResponse";
import { Button } from "@shared/ui/components/button";
import { toast } from "@shared/ui/components/sonner";
import { useTransition } from "react";
import { LoaderCircle } from "lucide-react";
import { GetComponentProps } from "@shared/ui/lib/types";
import { useRouter, useSearchParams } from "next/navigation";
import { APP_ROUTES, APP_ROUTES_CONFIG } from "@/lib/routes/routes";
import { generateUpdatedPathString } from "@/lib/utils/generateUpdatedPathString";
import { useAuthenticated } from "@/lib/hooks";

export const ScouterSignInBtn = (props: GetComponentProps<typeof Button>) => {
  const router = useRouter();
  const params = useSearchParams();

  const { user, activeMember, refetch } = useAuthenticated();

  const [isTransitionPending, startTransition] = useTransition();

  return (
    <Button
      {...props}
      className="[&_svg]:size-6"
      disabled={
        isTransitionPending ||
        activeMember?.organizationId === user.scoutingOrganizationId
      }
      onClick={() => {
        startTransition(async () => {
          try {
            await authClient.organization.setActive({
              organizationId: user.scoutingOrganizationId,
            });
            refetch();
            toast("Switched to scouter");
            router.push(
              `${generateUpdatedPathString(APP_ROUTES_CONFIG[APP_ROUTES.MODAL_SETTINGS].href, params)}`
            );
          } catch (error) {
            toast(formatErrorMessage(error));
          }
        });
      }}
    >
      {isTransitionPending ? (
        <LoaderCircle className="animate-spin h-6 w-6" />
      ) : (
        "SCOUTER"
      )}
    </Button>
  );
};
