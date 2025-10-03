"use client";

import { APP_ROUTES, APP_ROUTES_CONFIG } from "@/lib/routes/routes";
import { useTranslations } from "next-intl";
import Link from "next/link";

export const NotFoundCaption = () => {
  const t = useTranslations("NOT_FOUND");
  return (
    <span className="text-lg text-foreground/90">
      {t("page-not-found")}
      <Link
        className="ml-2 underline"
        href={APP_ROUTES_CONFIG[APP_ROUTES.AUCTION].href}
      >
        {t("go-home")}
      </Link>
    </span>
  );
};
