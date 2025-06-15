import { ValueOf } from "../types";

export const APP_LANG_TO_LOCALE_MAP = {
  "en-US": "en",
  "ru-RU": "ru",
  "es-ES": "es",
  "cn-CN": "cn",
} as const;
export type AppLocale = keyof typeof APP_LANG_TO_LOCALE_MAP;
export type AppLanguage = ValueOf<typeof APP_LANG_TO_LOCALE_MAP>;

export const getAppLocale = () => {
  const locale = process.env.NEXT_PUBLIC_APP_LOCALE;
  if (!locale?.length) {
    throw new Error("Locale not provided in Env vars");
  }
  if (!["en-US", "ru-RU", "es-ES", "cn-CN"].includes(locale)) {
    throw new Error("Unsupported locale");
  }

  return locale as AppLocale;
};
