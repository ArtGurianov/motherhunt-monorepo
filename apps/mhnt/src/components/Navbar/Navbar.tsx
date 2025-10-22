"use client";

import { usePathname } from "next/navigation";
import { Button } from "@shared/ui/components/button";
import { ChevronsLeft, MenuIcon, XIcon } from "lucide-react";
import { cn } from "@shared/ui/lib/utils";
import { useCallback, useEffect, useReducer, useMemo } from "react";
import { AppRole } from "@/lib/auth/permissions/app-permissions";
import { CustomMemberRole } from "@/lib/auth/customRoles";
import { APP_ROUTES, APP_ROUTES_CONFIG } from "@/lib/routes/routes";
import { NavbarContent } from "./NavbarContent";
import { motion, useAnimate } from "framer-motion";
import { usePreviousValue } from "@/lib/hooks/usePreviousValue";
import { useBreakpoint } from "@/lib/hooks/useBreakpoint";
import { useWindowSize } from "@/lib/hooks/useWindowSize";
import { useAuth } from "@/lib/hooks";

type NavbarState = {
  isNavbarCollapsed: boolean;
  isMenuOpened: boolean;
  displayRole: AppRole | CustomMemberRole | null;
  isSessionInitialized: boolean;
};

type NavbarAction =
  | { type: "TOGGLE_NAVBAR_COLLAPSED" }
  | { type: "TOGGLE_MENU_OPENED" }
  | { type: "SET_DISPLAY_ROLE"; payload: AppRole | CustomMemberRole | null }
  | { type: "INITIALIZE_SESSION" };

const navbarReducer = (
  state: NavbarState,
  action: NavbarAction
): NavbarState => {
  switch (action.type) {
    case "TOGGLE_NAVBAR_COLLAPSED":
      return { ...state, isNavbarCollapsed: !state.isNavbarCollapsed };
    case "TOGGLE_MENU_OPENED":
      return { ...state, isMenuOpened: !state.isMenuOpened };
    case "SET_DISPLAY_ROLE":
      return { ...state, displayRole: action.payload };
    case "INITIALIZE_SESSION":
      return { ...state, isSessionInitialized: true };
    default:
      return state;
  }
};

export const Navbar = () => {
  const windowSize = useWindowSize();
  const isWindowOverMD = useBreakpoint("md");

  const pathname = usePathname();

  const [state, dispatch] = useReducer(navbarReducer, {
    isNavbarCollapsed: false,
    isMenuOpened: false,
    displayRole: null,
    isSessionInitialized: false,
  });

  const { activeMember, isPending, session, user } = useAuth();

  const activeRole = useMemo(
    () => activeMember?.role ?? user?.role ?? null,
    [activeMember?.role, user?.role]
  );

  const [scope, animate] = useAnimate();
  const previousActiveRole = usePreviousValue(activeRole);

  const animationSequence = useCallback(async () => {
    if (!scope.current) return;
    dispatch({ type: "SET_DISPLAY_ROLE", payload: previousActiveRole ?? activeRole });
    await animate(
      scope.current,
      { transform: "translateY(100%)", opacity: 0 },
      {
        duration: 0.3,
        ease: "easeInOut"
      }
    );
    dispatch({ type: "SET_DISPLAY_ROLE", payload: activeRole });
    await animate(
      scope.current,
      { transform: "translateY(0%)", opacity: 1 },
      {
        duration: 0.3,
        ease: "easeInOut"
      }
    );
  }, [animate, previousActiveRole, activeRole]);

  useEffect(() => {
    if (!state.isSessionInitialized && !isPending) {
      dispatch({ type: "INITIALIZE_SESSION" });
    }
  }, [isPending, state.isSessionInitialized]);

  useEffect(() => {
    if (state.isSessionInitialized && previousActiveRole !== activeRole) {
      animationSequence();
    } else {
      dispatch({ type: "SET_DISPLAY_ROLE", payload: activeRole });
    }
  }, [activeRole, previousActiveRole, animationSequence, state.isSessionInitialized]);

  const collapsedPosition = useMemo(
    () =>
      isWindowOverMD
        ? "-100%"
        : `calc(-${windowSize.width / 2}px - 50%)`,
    [isWindowOverMD, windowSize.width]
  );

  useEffect(() => {
    if (!scope.current) return;

    animate(
      scope.current,
      {
        transform: `translateX(${state.isNavbarCollapsed ? collapsedPosition : "0%"})`,
      },
      {
        duration: 0.5,
        ease: "easeInOut"
      }
    );
  }, [state.isNavbarCollapsed, collapsedPosition, animate]);

  const toggleNavbarCollapsed = useCallback(() => {
    dispatch({ type: "TOGGLE_NAVBAR_COLLAPSED" });
  }, []);

  const toggleMenuOpened = useCallback(() => {
    dispatch({ type: "TOGGLE_MENU_OPENED" });
  }, []);

  if (
    pathname.startsWith(APP_ROUTES_CONFIG[APP_ROUTES.SIGN_IN].href) ||
    (isPending && !state.isSessionInitialized)
  )
    return null;

  return (
    <motion.nav
      ref={scope}
      initial={{ transform: "translateY(100%)", opacity: 0 }}
      animate={{ transform: "translateY(0%)", opacity: 1 }}
      transition={{
        duration: 0.3,
        ease: "easeInOut"
      }}
      className="h-nav fixed bottom-4 left-1/2 -translate-x-1/2 md:left-4 md:translate-x-0"
    >
      <div
        className={cn(
          "h-full flex border rounded-2xl overflow-clip opacity-100 transition-all duration-700 ease-in-out",
          {
            "opacity-0": state.isNavbarCollapsed,
          }
        )}
      >
        <div
          className={
            "relative flex h-full justify-center items-center bg-main/95"
          }
        >
          <NavbarContent
            activeRole={state.displayRole}
            isMenuOpened={state.isMenuOpened}
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
                  {state.isMenuOpened ? <XIcon /> : <MenuIcon />}
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <Button
        size="reset"
        variant="ghost"
        className={cn(
          "absolute top-1/2 -translate-y-1/2 -right-px translate-x-full [&_svg]:pointer-events-auto [&_svg]:size-10",
          {
            "-right-4": state.isNavbarCollapsed,
          }
        )}
        onClick={toggleNavbarCollapsed}
      >
        <ChevronsLeft
          className={cn("", {
            "rotate-180": state.isNavbarCollapsed,
          })}
        />
      </Button>
    </motion.nav>
  );
};
