import {
  APP_LOCALE_TO_LANG_MAP,
  AppLocale,
  getAppLocale,
} from "./getAppLocale";

const APP_PORT = 443;
const APP_HOST =
  process.env.NODE_ENV === "production" ? "mhnt.app" : "localhost";

export const getAppURL = (locale?: AppLocale) => {
  const lang = APP_LOCALE_TO_LANG_MAP[locale ?? getAppLocale()];
  const prefix = process.env.NODE_ENV === "production" ? "www." : "";

  return `https://${prefix}${lang === "en" || process.env.NODE_ENV !== "production" ? "" : `${lang}.`}${APP_HOST}:${APP_PORT}`;
};
