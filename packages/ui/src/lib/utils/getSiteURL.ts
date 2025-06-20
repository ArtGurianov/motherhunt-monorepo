import {
  APP_LANG_TO_LOCALE_MAP,
  AppLocale,
  getAppLocale,
} from "./getAppLocale";

const APP_PORT_DEVELOPMENT = 3000;
const APP_DOMAIN_NAME = "motherhunt";
const APP_DOMAIN_ZONE = ".com";

export const getSiteURL = (locale?: AppLocale) => {
  const lang = APP_LANG_TO_LOCALE_MAP[locale ?? getAppLocale()];
  const prefix = process.env.NODE_ENV === "production" ? "www." : "";
  const domainZone =
    process.env.NODE_ENV === "production" ? APP_DOMAIN_ZONE : ".local";

  const port =
    process.env.NODE_ENV === "production" ? "" : `:${APP_PORT_DEVELOPMENT}`;

  return `https://${prefix}${lang === "en" ? "" : `${lang}.`}${APP_DOMAIN_NAME}${domainZone}${port}`;
};
