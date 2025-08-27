"use client";

import { AgenciesList } from "@/components/SettingsContent/SettingsContentAgency/AgenciesList";
import { Button } from "@shared/ui/components/button";
import Link from "next/link";
import { useTranslations } from "next-intl";

export const SwitchAccountAgencyPageContent = () => {
  const t = useTranslations("AGENCY_SETTINGS");

  return (
    <div className="flex flex-col gap-2 w-full h-full justify-center items-center">
      <AgenciesList />
      <span className="text-2xl font-mono">{t("or-separator")}</span>
      <div className="flex flex-col gap-1">
        <Button asChild size="lg" className="font-mono">
          <Link href="/agency/apply" rel="noopener noreferrer" target="_blank">
            {t("register-agency")}
          </Link>
        </Button>
        <Button asChild variant="link" className="font-mono">
          <Link href="/settings/switch-account/agency/requests">
            {t("view-requests")}
          </Link>
        </Button>
      </div>
    </div>
  );
};
