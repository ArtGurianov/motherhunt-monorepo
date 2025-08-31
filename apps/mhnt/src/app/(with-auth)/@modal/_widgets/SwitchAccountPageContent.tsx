"use client";

import { Button } from "@shared/ui/components/button";
import { toast } from "@shared/ui/components/sonner";
import { LoaderCircle } from "lucide-react";
import { authClient } from "@/lib/auth/authClient";
import { Suspense, useTransition } from "react";
import { InterceptedLink } from "@/components/InterceptedLink/InterceptedLink";
import { useTranslations } from "next-intl";
import { ModelSignInBtn } from "@/components/ActionButtons/ModelSignInBtn";
import { useAuth } from "@/components/AppProviders/AuthProvider";
import { APP_ROUTES, APP_ROUTES_CONFIG } from "@/lib/routes/routes";
import { formatErrorMessage } from "@/lib/utils/createActionResponse";

export const SwitchAccountPageContent = () => {
  const { user, activeMember, refetch } = useAuth();

  const [isPending, startTransition] = useTransition();
  const tRoles = useTranslations("ROLES");

  return (
    <div className="flex flex-col gap-4 w-full h-full justify-center items-stretch px-8">
      {activeMember ? (
        <div className="w-full flex flex-col gap-2 justify-center items-center">
          <h4 className="text-center text-2xl font-medium font-sans">{`Currently logged in as ${tRoles(activeMember.role)}`}</h4>
          <span className="font-medium text-lg">{"- switch to -"}</span>
        </div>
      ) : (
        <h4 className="text-center text-2xl font-light">
          {"Choose account type"}
        </h4>
      )}
      <Button
        disabled={activeMember?.organizationId === user.scoutingOrganizationId}
        onClick={() => {
          startTransition(async () => {
            try {
              await authClient.organization.setActive({
                organizationId: user.scoutingOrganizationId,
              });
              refetch();
              toast("switched to scouter");
            } catch (error) {
              toast(formatErrorMessage(error));
            }
          });
        }}
      >
        {isPending ? <LoaderCircle className="animate-spin" /> : "SCOUTER"}
      </Button>
      <Suspense>
        <Button asChild>
          <InterceptedLink
            href={APP_ROUTES_CONFIG[APP_ROUTES.MODAL_SWITCH_AGENCY].href}
          >
            {"AGENCY"}
          </InterceptedLink>
        </Button>
      </Suspense>
      <ModelSignInBtn />
    </div>
  );
};
