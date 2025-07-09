"use client";

import { APP_ROUTES_CONFIG } from "@/lib/routes/routes";
import { Heading } from "@shared/ui/components/Heading";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

export const RouteHeading = () => {
  const pathname = usePathname();
  const t = useTranslations("ROUTES_TITLES");
  const title = t(
    Object.values(APP_ROUTES_CONFIG).find((each) => each.href === pathname)
      ?.key ?? "default"
  );

  return <Heading>{title}</Heading>;
};
