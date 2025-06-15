"use client";

import { PageSection } from "@/components/PageSection";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  const t = useTranslations("ERRORS.404");

  return (
    <PageSection className="flex grow justify-center items-center">
      <div className="w-full max-w-sm flex flex-col justify-center items-center">
        <Image
          src="/404.png"
          width="0"
          height="0"
          sizes="100vw"
          alt="logo"
          className="h-auto w-full shrink-0"
          priority
        />
        <span className="text-lg text-foreground/90">
          {t("message-before")}
          <Link className="ml-2 underline" href="/">
            {t("message-action")}
          </Link>
        </span>
      </div>
    </PageSection>
  );
}
