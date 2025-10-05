"use client";

import { useAppParams } from "@/lib/hooks";
import { StatusCardLoading } from "@shared/ui/components/StatusCard";
import {
  APP_LOCALE_TO_LANG_MAP,
  AppLocale,
  getAppURL,
} from "@shared/ui/lib/utils";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { getEnvConfigClient } from "@/lib/config/env";

export const AppLocaleGuard = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { getUpdatedPathString } = useAppParams();
  const [isLocked, setIsLocked] = useState(true);

  useEffect(() => {
    const recentLocale = Cookies.get("RECENT_LOCALE");
    if (
      // means no language provided in subdomain
      window.location.host.startsWith("mhnt.") ||
      window.location.host.startsWith("www.mhnt.")
    ) {
      if (recentLocale && recentLocale !== "en-US") {
        router.push(
          `${getAppURL(recentLocale as AppLocale)}${getUpdatedPathString()}`
        );
      }
    } else {
      // language provided in subdomain
      const particles = window.location.host.split(".");
      const currentLangSubdomain =
        particles[0] === "www" ? particles[1] : particles[0];
      if (
        currentLangSubdomain !==
        APP_LOCALE_TO_LANG_MAP[(recentLocale ?? "en-US") as AppLocale]
      ) {
        let updatedLocale: AppLocale;
        switch (currentLangSubdomain) {
          case "es":
            updatedLocale = "es-ES";
            break;
          case "cn":
            updatedLocale = "cn-CN";
            break;
          case "ru":
            updatedLocale = "ru-RU";
            break;
          default:
            updatedLocale = "en-US";
        }

        Cookies.set("RECENT_LOCALE", updatedLocale, {
          domain:
            getEnvConfigClient().NODE_ENV === "production"
              ? "mhnt.app"
              : "localhost",
        });
      }
    }
    setIsLocked(false);
  }, []);

  if (isLocked) return <StatusCardLoading />;

  return children;
};
