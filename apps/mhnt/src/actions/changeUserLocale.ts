"use server";

import { AppLocale, getAppURL } from "@shared/ui/lib/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const changeUserLocale = async (locale: AppLocale) => {
  const cookieStore = await cookies();
  cookieStore.set("recent-locale", locale, {
    httpOnly: true,
    secure: true,
    domain: "mhnt.app",
  });
  redirect(getAppURL(locale));
};
