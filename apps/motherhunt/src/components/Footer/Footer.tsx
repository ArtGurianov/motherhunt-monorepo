"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

export const Footer = () => {
  const t = useTranslations("FOOTER");
  const now = new Date();

  return (
    <footer className="flex w-full h-footer border-t-4 bg-accent-foreground/70 justify-center items-center text-sm">
      <Link className="underline font-bold" href="https://www.mydaogs.xyz">
        {"MyDAOgs"}
      </Link>
      <span className="ml-1">{` ${t("ecosystem")} ${now.getFullYear()}. ${t(
        "rights"
      )}`}</span>
    </footer>
  );
};
