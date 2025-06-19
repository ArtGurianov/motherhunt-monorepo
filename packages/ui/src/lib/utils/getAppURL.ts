import { APP_LANG_TO_LOCALE_MAP, getAppLocale } from "./getAppLocale";

const APP_PORT_DEVELOPMENT = 3001;
const APP_DOMAIN_NAME = "mhnt";
const APP_DOMAIN_ZONE = ".app";

export const getAppURL = () => {
  const lang = APP_LANG_TO_LOCALE_MAP[getAppLocale()];
  const port =
    process.env.NODE_ENV === "production" ? "" : `:${APP_PORT_DEVELOPMENT}`;
  const domainZone =
    process.env.NODE_ENV === "production" ? APP_DOMAIN_ZONE : ".local";

  return `https://${lang === "en" ? "" : `${lang}.`}${APP_DOMAIN_NAME}${domainZone}${port}`;
};
