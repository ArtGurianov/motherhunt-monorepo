"use client";

import { authClient } from "@/lib/auth/authClient";
import { Button } from "@shared/ui/components/button";
import { toast } from "@shared/ui/components/sonner";
import { useTransition } from "react";
import { LoaderCircle } from "lucide-react";
import { GetComponentProps } from "@shared/ui/lib/types";
import { useRouter, useSearchParams } from "next/navigation";
import { APP_ROUTES, APP_ROUTES_CONFIG } from "@/lib/routes/routes";
import { generateUpdatedPathString } from "@/lib/utils/generateUpdatedPathString";
import { SESSION_QUERY_KEY, useAuthenticated } from "@/lib/hooks";
import { useQueryClient } from "@tanstack/react-query";

export const ScouterSignInBtn = (props: GetComponentProps<typeof Button>) => {
  const router = useRouter();
  const params = useSearchParams();
  const queryClient = useQueryClient();

  const { user, activeMember } = useAuthenticated();

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
              fetchOptions: {
                onSuccess: () =>
                  queryClient.invalidateQueries({
                    queryKey: [SESSION_QUERY_KEY],
                  }),
              },
            });
            toast("Switched to scouter");
            router.push(
              `${generateUpdatedPathString(APP_ROUTES_CONFIG[APP_ROUTES.MODAL_SETTINGS].href, params)}`,
            );
          } catch (error) {
            toast(
              error instanceof Error ? error.message : "Something went wrong.",
            );
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
