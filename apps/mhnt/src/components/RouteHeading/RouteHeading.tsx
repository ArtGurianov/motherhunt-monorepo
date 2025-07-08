"use client";

import { APP_ROUTES, APP_ROUTES_CONFIG, AppRoute } from "@/lib/routes/routes";
import { Heading } from "@shared/ui/components/Heading";
import { usePathname } from "next/navigation";

export const RouteHeading = () => {
  const pathname = usePathname();
  let title = "Unknown Page";
  for (const each of Object.values(APP_ROUTES)) {
    const config = APP_ROUTES_CONFIG[each as AppRoute];
    if (config.href === pathname) {
      title = config.label;
    }
  }
  return <Heading>{title}</Heading>;
};
