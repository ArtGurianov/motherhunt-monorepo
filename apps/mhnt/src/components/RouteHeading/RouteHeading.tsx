"use client";

import { APP_ROUTES_CONFIG } from "@/lib/routes/routes";
import { Heading } from "@shared/ui/components/Heading";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

const ROUTE_CONFIGS = Object.values(APP_ROUTES_CONFIG);
const DYNAMIC_ROUTE_REGEX_PATTERN = /[\[\]]/;

const useMatchingRoute = () => {
  const pathname = usePathname();
  const exactMatch = ROUTE_CONFIGS.find((each) => each.href === pathname)?.key;
  if (exactMatch) return exactMatch;
  const particles = pathname.split("/");
  const dynamicRoutes = ROUTE_CONFIGS.filter((each) =>
    DYNAMIC_ROUTE_REGEX_PATTERN.test(each.href)
  );
  const dynamicMatch = dynamicRoutes.find((each) => {
    const eachParticles = each.href.split("/");
    if (particles.length !== eachParticles.length) return false;
    return particles.reduce(
      (temp, next, index) =>
        temp &&
        (next === eachParticles[index] ||
          (eachParticles[index]!.startsWith("[") &&
            eachParticles[index]!.endsWith("]"))),
      true
    );
  })?.key;
  return dynamicMatch ? dynamicMatch : null;
};

export const RouteHeading = () => {
  const t = useTranslations("ROUTES_TITLES");
  const routeId = useMatchingRoute();
  const title = t(routeId ?? "default");

  return <Heading>{title}</Heading>;
};
