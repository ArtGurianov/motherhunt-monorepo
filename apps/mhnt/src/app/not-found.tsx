"use client";

import { PageSection } from "@shared/ui/components/PageSection";
import { AppImage } from "@/components/AppImage/AppImage";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { APP_ROUTES, APP_ROUTES_CONFIG } from "@/lib/routes/routes";

export default function NotFound() {
  const t = useTranslations("NOT_FOUND");

  return (
    <PageSection className="flex grow justify-center items-center">
      <div className="w-full max-w-sm flex flex-col justify-center items-center">
        <AppImage
          src="/404.png"
          width="0"
          height="0"
          sizes="100vw"
          alt="logo"
          className="h-auto w-full shrink-0"
          priority
        />
        <span className="text-lg text-foreground/90">
          {t("page-not-found")}
          <Link
            className="ml-2 underline"
            href={APP_ROUTES_CONFIG[APP_ROUTES.AUCTION].href}
          >
            {t("go-home")}
          </Link>
        </span>
      </div>
    </PageSection>
  );
}
