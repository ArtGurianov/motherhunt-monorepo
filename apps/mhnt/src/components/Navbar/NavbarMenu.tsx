"use client";

import { cn } from "@shared/ui/lib/utils";
import {
  NAV_ROUTES_ORDERS,
  NAV_ROUTES_SVG_PATHS,
} from "@/lib/routes/navRoutes";
import { AppRole } from "@/lib/auth/permissions/app-permissions";
import { NavbarMenuItem } from "./NavbarMenuItem";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { APP_ROUTES_CONFIG } from "@/lib/routes/routes";
import { CustomMemberRole } from "@/lib/auth/customRoles";

interface NavbarMenuProps {
  isOpened: boolean;
  activeRole: AppRole | CustomMemberRole | null;
}

export const NavbarMenu = ({ isOpened, activeRole }: NavbarMenuProps) => {
  const pathname = usePathname();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!activeRole) return null;

  const order = NAV_ROUTES_ORDERS[activeRole];

  return (
    <div
      className={cn(
        "absolute md:static left-full w-full h-full md:w-auto flex gap-2 justify-center items-center transition-all duration-500 px-2 md:pr-4 py-2",
        {
          "invisible md:visible": !isOpened,
        }
      )}
    >
      {order.map((routeId, index) => {
        const config = APP_ROUTES_CONFIG[routeId as (typeof order)[number]];
        return (
          <NavbarMenuItem
            key={routeId}
            href={config.href}
            svgPath={NAV_ROUTES_SVG_PATHS[routeId]}
            onMouseOver={() => {
              setHoveredIndex(index);
            }}
            onMouseOut={() => {
              setHoveredIndex(null);
            }}
            isActive={pathname === config.href && !hoveredIndex}
          />
        );
      })}
    </div>
  );
};
