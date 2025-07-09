"use client";

import { cn } from "@shared/ui/lib/utils";
import {
  NAV_ROUTES_ORDERS,
  NAV_ROUTES_SVG_PATHS,
} from "@/lib/routes/navRoutes";
import { AppRole } from "@/lib/auth/permissions/app-permissions";
import { AgencyRole } from "@/lib/auth/permissions/agency-permissions";
import { NavbarMenuItem } from "./NavbarMenuItem";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { APP_ROUTES_CONFIG } from "@/lib/routes/routes";

interface NavbarMenuProps<R extends AppRole | AgencyRole> {
  isOpened: boolean;
  role: R;
}

export const NavbarMenu = <R extends AppRole | AgencyRole>({
  isOpened,
  role,
}: NavbarMenuProps<R>) => {
  const pathname = usePathname();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const order = NAV_ROUTES_ORDERS[role];

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
