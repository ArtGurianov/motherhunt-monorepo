"use server";

import { getEnvConfigServer } from "@/lib/config/env";
import { AppLocale, getAppURL } from "@shared/ui/lib/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const changeUserLocale = async (locale: AppLocale) => {
  const cookieStore = await cookies();
  cookieStore.set("recent-locale", locale, {
    httpOnly: true,
    secure: true,
    domain:
      getEnvConfigServer().NODE_ENV === "production" ? "mhnt.app" : "localhost",
  });
  redirect(getAppURL(locale));
};
