"use client";

import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth/authClient";
import { Button } from "@shared/ui/components/button";
import { ChevronsLeft, MenuIcon, XIcon } from "lucide-react";
import { cn } from "@shared/ui/lib/utils";
import { useState, useMemo, useCallback } from "react";
import { AppRole } from "@/lib/auth/permissions/app-permissions";
import { CustomMemberRole, getCustomMemberRole } from "@/lib/auth/customRoles";
import { APP_ROUTES, APP_ROUTES_CONFIG } from "@/lib/routes/routes";
import { OrgType } from "@/lib/utils/types";
import { OrgRole } from "@/lib/auth/permissions/org-permissions";
import { NavbarContent } from "./NavbarContent";

export const Navbar = () => {
  const { data: session } = authClient.useSession();

  const activeRole: AppRole | CustomMemberRole | null = useMemo(() => {
    if (!session) return null;

    const hasActiveOrg = Boolean(
      session.session.activeOrganizationId &&
        session.session.activeOrganizationName &&
        session.session.activeOrganizationType &&
        session.session.activeOrganizationRole
    );

    return hasActiveOrg
      ? getCustomMemberRole(
          session.session.activeOrganizationType as OrgType,
          session.session.activeOrganizationRole as OrgRole
        )
      : ((session.user.role as AppRole) ?? null);
  }, [session]);

  const pathname = usePathname();
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);
  const [isMenuOpened, setIsMenuOpened] = useState(false);

  const toggleNavbarCollapsed = useCallback(() => {
    setIsNavbarCollapsed((prev) => !prev);
  }, []);

  const toggleMenuOpened = useCallback(() => {
    setIsMenuOpened((prev) => !prev);
  }, []);

  if (pathname.startsWith(APP_ROUTES_CONFIG[APP_ROUTES.SIGN_IN].href))
    return null;

  return (
    <nav
      className={cn(
        "h-nav fixed bottom-4 left-1/2 -translate-x-1/2 lg:left-4 lg:translate-x-0 transition-all duration-700 ease-in-out",
        {
          "-translate-x-full left-0 lg:-translate-x-full lg:left-0":
            isNavbarCollapsed,
        }
      )}
    >
      <div className="relative h-full">
        <div
          className={cn(
            "h-full flex border rounded-2xl overflow-clip opacity-100 transition-all duration-700 ease-in-out",
            {
              "opacity-0": isNavbarCollapsed,
            }
          )}
        >
          <div
            className={
              "relative flex h-full justify-center items-center bg-main/95"
            }
          >
            <>
              <NavbarContent
                activeRole={activeRole}
                isMenuOpened={isMenuOpened}
              />
              {session ? (
                <div className="relative w-12 h-full md:hidden">
                  <div className="absolute h-full w-full top-0 left-0 bg-secondary/95 flex justify-center items-center border-l">
                    <Button
                      size="reset"
                      variant="ghost"
                      className="md:hidden [&_svg]:pointer-events-auto [&_svg]:size-8"
                      onClick={toggleMenuOpened}
                    >
                      {isMenuOpened ? <XIcon /> : <MenuIcon />}
                    </Button>
                  </div>
                </div>
              ) : null}
            </>
          </div>
        </div>
        <Button
          size="reset"
          variant="ghost"
          className={cn(
            "absolute top-1/2 -translate-y-1/2 -right-px translate-x-full [&_svg]:pointer-events-auto [&_svg]:size-10",
            {
              "-right-4": isNavbarCollapsed,
            }
          )}
          onClick={toggleNavbarCollapsed}
        >
          <ChevronsLeft
            className={cn("", {
              "rotate-180": isNavbarCollapsed,
            })}
          />
        </Button>
      </div>
    </nav>
  );
};
