import {
  APP_LOCALE_TO_LANG_MAP,
  AppLocale,
  getAppLocale,
} from "./getAppLocale";

const APP_PORT_DEVELOPMENT = 3001;
const APP_DOMAIN_NAME = "mhnt";
const APP_DOMAIN_ZONE = ".app";

export const getAppURL = (locale?: AppLocale) => {
  const lang = APP_LOCALE_TO_LANG_MAP[locale ?? getAppLocale()];
  const prefix = process.env.NODE_ENV === "production" ? "www." : "";
  const domainZone =
    process.env.NODE_ENV === "production" ? APP_DOMAIN_ZONE : ".local";
  const port =
    process.env.NODE_ENV === "production" ? "" : `:${APP_PORT_DEVELOPMENT}`;

  return `https://${prefix}${lang === "en" ? "" : `${lang}.`}${APP_DOMAIN_NAME}${domainZone}${port}`;
};
