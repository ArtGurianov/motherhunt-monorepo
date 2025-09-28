"use client";

import { usePathname } from "next/navigation";
import { Button } from "@shared/ui/components/button";
import { ChevronsLeft, MenuIcon, XIcon } from "lucide-react";
import { cn } from "@shared/ui/lib/utils";
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { AppRole } from "@/lib/auth/permissions/app-permissions";
import { CustomMemberRole, getCustomMemberRole } from "@/lib/auth/customRoles";
import { APP_ROUTES, APP_ROUTES_CONFIG } from "@/lib/routes/routes";
import { OrgType } from "@/lib/utils/types";
import { OrgRole } from "@/lib/auth/permissions/org-permissions";
import { NavbarContent } from "./NavbarContent";
import { motion, useAnimate } from "framer-motion";
import { usePreviousValue } from "@/lib/hooks/usePreviousValue";
import { useBreakpoint } from "@/lib/hooks/useBreakpoint";
import { useWindowSize } from "@/lib/hooks/useWindowSize";
import { useAuth } from "@/lib/hooks";

export const Navbar = () => {
  const windowSize = useWindowSize();
  const isWindowOverMD = useBreakpoint("md");

  const pathname = usePathname();
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);
  const [isMenuOpened, setIsMenuOpened] = useState(false);

  const { activeMember, isPending, session, user } = useAuth();
  const activeRole = activeMember?.role ?? user?.role ?? null;

  const [scope, animate] = useAnimate();
  const previousActiveRole = usePreviousValue(activeRole);
  const isSessionInitialized = useRef(false);
  const [displayRole, setDisplayRole] = useState<
    AppRole | CustomMemberRole | null
  >(activeRole);

  const animationSequence = useCallback(async () => {
    if (!scope.current) return;
    setDisplayRole(previousActiveRole ?? activeRole);
    await animate(
      scope.current,
      { transform: "translateY(100%)", opacity: 0 },
      { duration: 0.3, ease: "easeInOut" }
    );
    setDisplayRole(activeRole);
    await animate(
      scope.current,
      { transform: "translateY(0%)", opacity: 1 },
      { duration: 0.3, ease: "easeInOut" }
    );
  }, [animate, scope, previousActiveRole, activeRole]);

  useEffect(() => {
    if (!isSessionInitialized.current && !isPending) {
      isSessionInitialized.current = true;
    }
  }, [isPending]);

  useEffect(() => {
    if (isSessionInitialized.current && previousActiveRole !== activeRole) {
      animationSequence();
    } else {
      setDisplayRole(activeRole);
    }
  }, [activeRole, previousActiveRole, animationSequence]);

  useEffect(() => {
    if (!scope.current) return;

    const collapsedPosition = isWindowOverMD
      ? "-100%"
      : `calc(-${windowSize.width / 2}px - 50%)`;

    animate(
      scope.current,
      {
        transform: `translateX(${isNavbarCollapsed ? collapsedPosition : "0%"})`,
      },
      { duration: 0.5, ease: "easeInOut" }
    );
  }, [isNavbarCollapsed, windowSize.width]);

  const toggleNavbarCollapsed = useCallback(() => {
    setIsNavbarCollapsed((prev) => !prev);
  }, []);

  const toggleMenuOpened = useCallback(() => {
    setIsMenuOpened((prev) => !prev);
  }, []);

  if (
    pathname.startsWith(APP_ROUTES_CONFIG[APP_ROUTES.SIGN_IN].href) ||
    (isPending && !isSessionInitialized.current)
  )
    return null;

  return (
    <motion.nav
      ref={scope}
      initial={{ transform: "translateY(100%)", opacity: 0 }}
      animate={{ transform: "translateY(0%)", opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-nav fixed bottom-4 left-1/2 -translate-x-1/2 md:left-4 md:translate-x-0"
    >
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
              activeRole={displayRole}
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
    </motion.nav>
  );
};
