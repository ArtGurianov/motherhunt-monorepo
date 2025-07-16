import {
  APP_LOCALE_TO_LANG_MAP,
  AppLocale,
  getAppLocale,
} from "./getAppLocale";

const SITE_PORT = process.env.NODE_ENV === "production" ? 443 : 3000;
const SITE_HOST =
  process.env.NODE_ENV === "production" ? "motherhunt.com" : "localhost";

export const getSiteURL = (locale?: AppLocale) => {
  const lang = APP_LOCALE_TO_LANG_MAP[locale ?? getAppLocale()];
  const prefix = process.env.NODE_ENV === "production" ? "www." : "";

  return `https://${prefix}${lang === "en" || process.env.NODE_ENV !== "production" ? "" : `${lang}.`}${SITE_HOST}:${SITE_PORT}`;
};
