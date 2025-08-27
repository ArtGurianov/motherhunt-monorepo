"use client";

import { useMatchingRoute } from "@/lib/hooks";
import { Heading } from "@shared/ui/components/Heading";
import { useTranslations } from "next-intl";

export const RouteHeading = () => {
  const t = useTranslations("ROUTES_TITLES");
  const routeId = useMatchingRoute();
  const title = t(routeId ?? "default");

  return <Heading>{title}</Heading>;
};
