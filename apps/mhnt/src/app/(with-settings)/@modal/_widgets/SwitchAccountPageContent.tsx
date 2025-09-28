"use client";

import { Button } from "@shared/ui/components/button";
import { Suspense } from "react";
import { InterceptedLink } from "@/components/InterceptedLink/InterceptedLink";
import { useTranslations } from "next-intl";
import { ModelSignInBtn } from "@/components/ActionButtons/ModelSignInBtn";
import { APP_ROUTES, APP_ROUTES_CONFIG } from "@/lib/routes/routes";
import { ScouterSignInBtn } from "@/components/ActionButtons/ScouterSignInBtn";
import { useAuthenticated } from "@/lib/hooks";

export const SwitchAccountPageContent = () => {
  const { activeMember } = useAuthenticated();
  const tRoles = useTranslations("ROLES");

  return (
    <div className="flex flex-col gap-4 w-full h-full justify-center items-stretch px-8">
      {activeMember ? (
        <div className="w-full flex flex-col gap-2 justify-center items-center">
          <h4 className="py-2 w-full text-center text-2xl font-medium font-sans bg-linear-to-r from-secondary/0 via-secondary/50 to-secondary/0">{`Currently logged in as ${tRoles(activeMember.role)}`}</h4>
          <span className="font-medium text-lg">{"- switch to -"}</span>
        </div>
      ) : (
        <h4 className="text-center text-2xl font-light">
          {"Choose account type"}
        </h4>
      )}
      <ScouterSignInBtn />
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
