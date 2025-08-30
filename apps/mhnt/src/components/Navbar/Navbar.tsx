"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth/authClient";
import { Button } from "@shared/ui/components/button";
import {
  ChevronsLeft,
  LoaderCircle,
  LogIn,
  MenuIcon,
  UserCog,
  XIcon,
} from "lucide-react";
import { cn } from "@shared/ui/lib/utils";
import { InterceptedLink } from "@/components/InterceptedLink/InterceptedLink";
import { Suspense, useState } from "react";
import { NavbarMenu } from "./NavbarMenu";
import { AppRole } from "@/lib/auth/permissions/app-permissions";
import { useTranslations } from "next-intl";
import { CustomMemberRole, getCustomMemberRole } from "@/lib/auth/customRoles";
import { APP_ROUTES, APP_ROUTES_CONFIG } from "@/lib/routes/routes";
import { OrgType } from "@/lib/utils/types";
import { OrgRole } from "@/lib/auth/permissions/org-permissions";

export const Navbar = () => {
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();

  const pathname = usePathname();
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const t = useTranslations("NAVBAR");
  const tCommon = useTranslations("COMMON");
  const tRoles = useTranslations("ROLES");

  if (pathname.startsWith(APP_ROUTES_CONFIG[APP_ROUTES.SIGN_IN].href))
    return null;

  const activeRole: AppRole | CustomMemberRole | null = Boolean(
    session?.session.activeOrganizationId &&
      session?.session.activeOrganizationName &&
      session?.session.activeOrganizationType &&
      session?.session.activeOrganizationRole
  )
    ? getCustomMemberRole(
        session!.session.activeOrganizationType as OrgType,
        session!.session.activeOrganizationRole as OrgRole
      )
    : ((session?.user.role as AppRole) ?? null);

  const displayContent = session ? (
    <div
      className={cn(
        "relative flex h-full -translate-x-0 transition-all duration-500 ease-in-out",
        {
          "-translate-x-full": isMenuOpened,
        }
      )}
    >
      <div className="flex flex-col items-center justify-center px-4">
        <span className="text-md text-center text-nowrap">
          {`${t("signed-in-label")}:`}
        </span>
        <span className="flex gap-2 justify-center items-center">
          <Suspense fallback={tCommon("loading")}>
            <Button
              asChild
              variant="ghost"
              size="reset"
              className="text-2xl text-center font-mono underline text-nowrap"
            >
              <InterceptedLink
                href={APP_ROUTES_CONFIG[APP_ROUTES.MODAL_SETTINGS].href}
              >
                {tRoles(activeRole!)}
              </InterceptedLink>
            </Button>
          </Suspense>
          <Suspense fallback={tCommon("loading")}>
            <Button
              asChild
              size="reset"
              variant="secondary"
              className="p-px [&_svg]:pointer-events-auto [&_svg]:size-6"
            >
              <InterceptedLink
                href={APP_ROUTES_CONFIG[APP_ROUTES.MODAL_SETTINGS].href}
              >
                <UserCog />
              </InterceptedLink>
            </Button>
          </Suspense>
        </span>
      </div>
      <NavbarMenu
        isOpened={isMenuOpened}
        role={activeRole! as AppRole | CustomMemberRole}
      />
    </div>
  ) : (
    <div className="flex flex-col items-center px-6">
      <span className="text-md text-center text-nowrap">
        {t("signed-out-label")}
      </span>
      <span className="flex gap-2 justify-center items-center">
        <Button
          asChild
          variant="ghost"
          size="reset"
          className="text-2xl text-center font-mono underline"
        >
          <Link
            href={APP_ROUTES_CONFIG[APP_ROUTES.MODAL_SETTINGS].href}
            className="text-nowrap"
          >
            {t("signed-out-status")}
          </Link>
        </Button>
        <Button
          asChild
          size="reset"
          variant="secondary"
          className="p-px [&_svg]:pointer-events-auto [&_svg]:size-6"
        >
          <Link href={APP_ROUTES_CONFIG[APP_ROUTES.SIGN_IN].href}>
            <LogIn />
          </Link>
        </Button>
      </span>
    </div>
  );

  return (
    <nav
      className={cn(
        "h-nav fixed bottom-4 left-1/2 -translate-x-1/2 lg:left-4 lg:translate-x-0 transition-all duration-700 ease-in-out",
        {
          "-translate-x-full left-0 lg:-translate-x-full lg:left-0":
            !isNavbarVisible,
        }
      )}
    >
      <div className="relative h-full">
        <div
          className={cn(
            "h-full flex border rounded-2xl overflow-clip opacity-100 transition-all duration-700 ease-in-out",
            {
              "opacity-0": !isNavbarVisible,
            }
          )}
        >
          <div className="relative flex h-full justify-center items-center bg-main/95">
            {isSessionPending ? (
              <span className="flex gap-2 justify-center items-center p-6">
                <LoaderCircle className="animate-spin h-8 w-8" />
                {tCommon("loading")}
              </span>
            ) : (
              <>
                {displayContent}
                {session ? (
                  <div className="relative w-12 h-full md:hidden">
                    <div className="absolute h-full w-full top-0 left-0 bg-secondary/95 flex justify-center items-center border-l">
                      <Button
                        size="reset"
                        variant="ghost"
                        className="md:hidden [&_svg]:pointer-events-auto [&_svg]:size-8"
                        onClick={() => setIsMenuOpened((prev) => !prev)}
                      >
                        {isMenuOpened ? <XIcon /> : <MenuIcon />}
                      </Button>
                    </div>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
        <Button
          size="reset"
          variant="ghost"
          className={cn(
            "absolute top-1/2 -translate-y-1/2 -right-px translate-x-full [&_svg]:pointer-events-auto [&_svg]:size-10",
            { "-right-4": !isNavbarVisible }
          )}
          onClick={() => setIsNavbarVisible((prev) => !prev)}
        >
          <ChevronsLeft
            className={cn("", {
              "rotate-180": !isNavbarVisible,
            })}
          />
        </Button>
      </div>
    </nav>
  );
};
