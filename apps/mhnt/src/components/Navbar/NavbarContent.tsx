"use client";

import { Button } from "@shared/ui/components/button";
import { cn } from "@shared/ui/lib/utils";
import { Suspense } from "react";
import { InterceptedLink } from "../InterceptedLink/InterceptedLink";
import { APP_ROUTES, APP_ROUTES_CONFIG } from "@/lib/routes/routes";
import { LogIn, UserCog } from "lucide-react";
import { NavbarMenu } from "./NavbarMenu";
import { AppRole } from "@/lib/auth/permissions/app-permissions";
import { CustomMemberRole } from "@/lib/auth/customRoles";
import { useTranslations } from "next-intl";

interface NavbarContentProps {
  isMenuOpened: boolean;
  activeRole: AppRole | CustomMemberRole | null;
}

export const NavbarContent = ({
  activeRole,
  isMenuOpened,
}: NavbarContentProps) => {
  const t = useTranslations("NAVBAR");
  const tCommon = useTranslations("COMMON");
  const tRoles = useTranslations("ROLES");

  return (
    <div
      className={cn(
        "relative flex h-full -translate-x-0 transition-all duration-500 ease-in-out",
        {
          "-translate-x-full": isMenuOpened,
        },
      )}
    >
      <div className="flex flex-col items-center justify-center px-4">
        <span className="text-md text-center text-nowrap">
          {`${t(activeRole ? "signed-in-label" : "signed-out-label")}:`}
        </span>
        <Suspense
          fallback={<span className="text-sm">{tCommon("loading")}</span>}
        >
          <span className="flex gap-2 justify-center items-center">
            <Button
              asChild
              variant="ghost"
              size="reset"
              className="text-2xl text-center font-mono underline text-nowrap"
            >
              <InterceptedLink
                href={
                  activeRole
                    ? APP_ROUTES_CONFIG[APP_ROUTES.MODAL_SETTINGS].href
                    : APP_ROUTES_CONFIG[APP_ROUTES.SIGN_IN].href
                }
              >
                {activeRole ? tRoles(activeRole) : t("signed-out-status")}
              </InterceptedLink>
            </Button>
            <Button
              asChild
              size="reset"
              variant="secondary"
              className="p-px [&_svg]:pointer-events-auto [&_svg]:size-6"
            >
              <InterceptedLink
                href={
                  activeRole
                    ? APP_ROUTES_CONFIG[APP_ROUTES.MODAL_SETTINGS].href
                    : APP_ROUTES_CONFIG[APP_ROUTES.SIGN_IN].href
                }
              >
                {activeRole ? <UserCog /> : <LogIn />}
              </InterceptedLink>
            </Button>
          </span>
        </Suspense>
      </div>
      <NavbarMenu isOpened={isMenuOpened} activeRole={activeRole} />
    </div>
  );
};
