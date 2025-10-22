import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { APP_ROUTES_CONFIG } from "@/lib/routes/routes";

const ROUTE_CONFIGS = Object.values(APP_ROUTES_CONFIG);

export const useMatchingRoute = () => {
  const pathname = usePathname();

  return useMemo(() => {
    const exactMatch = ROUTE_CONFIGS.find((route) => route.href === pathname);
    if (exactMatch) return exactMatch.key;

    const pathSegments = pathname.split("/");

    const dynamicMatch = ROUTE_CONFIGS.filter((route) =>
      route.href.includes("["),
    ).find((route) => {
      const routeSegments = route.href.split("/");

      if (pathSegments.length !== routeSegments.length) return false;

      return routeSegments.every((routeSegment, index) => {
        const pathSegment = pathSegments[index];
        return (
          pathSegment === routeSegment ||
          (routeSegment.startsWith("[") && routeSegment.endsWith("]"))
        );
      });
    });

    return dynamicMatch?.key ?? null;
  }, [pathname]);
};
