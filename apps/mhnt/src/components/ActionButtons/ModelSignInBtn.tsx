"use client";

import { authClient } from "@/lib/auth/authClient";
import { Button } from "@shared/ui/components/button";
import { GetComponentProps } from "@shared/ui/lib/types";
import { Suspense, useTransition } from "react";
import { toast } from "@shared/ui/components/sonner";
import { APP_ROUTES, APP_ROUTES_CONFIG } from "@/lib/routes/routes";
import { CUSTOM_MEMBER_ROLES } from "@/lib/auth/customRoles";
import { LoaderCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { generateUpdatedPathString } from "@/lib/utils/generateUpdatedPathString";
import { InterceptedLink } from "../InterceptedLink/InterceptedLink";
import { SESSION_QUERY_KEY, useAuthenticated } from "@/lib/hooks";
import { useQueryClient } from "@tanstack/react-query";

export const ModelSignInBtn = (props: GetComponentProps<typeof Button>) => {
  const router = useRouter();
  const params = useSearchParams();
  const queryClient = useQueryClient();

  const { user, activeMember } = useAuthenticated();

  const [isTransitionPending, startTransition] = useTransition();

  if (!user.modelSocialId || !user.modelOrganizationId) {
    return (
      <Suspense>
        <Button asChild {...props}>
          <InterceptedLink
            href={APP_ROUTES_CONFIG[APP_ROUTES.MODAL_SWITCH_MODEL].href}
          >
            {"MODEL"}
          </InterceptedLink>
        </Button>
      </Suspense>
    );
  }

  return (
    <Button
      {...props}
      className="[&_svg]:size-6"
      disabled={
        isTransitionPending ||
        activeMember?.role === CUSTOM_MEMBER_ROLES.MODEL_ROLE
      }
      onClick={() => {
        startTransition(async () => {
          try {
            await authClient.organization.setActive({
              organizationId: user.modelOrganizationId,
              fetchOptions: {
                onSuccess: () =>
                  queryClient.invalidateQueries({
                    queryKey: [SESSION_QUERY_KEY],
                  }),
              },
            });
            toast("Switched to Model");
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
        <LoaderCircle className="animate-spin" />
      ) : (
        "MODEL"
      )}
    </Button>
  );
};
