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
import { CUSTOM_MEMBER_ROLES } from "@/lib/auth/customRoles";
import { LoaderCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { generateUpdatedPathString } from "@/lib/utils/generateUpdatedPathString";

export const ModelSignInBtn = (props: GetComponentProps<typeof Button>) => {
  const router = useRouter();
  const params = useSearchParams();

  const { user, refetch, activeMember } = useAuth();

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
            });
            refetch();
            toast("Switched to Model");
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
        <LoaderCircle className="animate-spin" />
      ) : (
        "MODEL"
      )}
    </Button>
  );
};
