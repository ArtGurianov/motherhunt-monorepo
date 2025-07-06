import { ValueOf } from "@shared/ui/lib/types";
import { AppClientError } from "./appClientError";

export const APP_LOCALE_TO_LANG_MAP = {
  "en-US": "en",
  "ru-RU": "ru",
  "es-ES": "es",
  "cn-CN": "cn",
} as const;
export type AppLocale = keyof typeof APP_LOCALE_TO_LANG_MAP;
export type AppLanguage = ValueOf<typeof APP_LOCALE_TO_LANG_MAP>;

export const getAppLocale = () => {
  const locale = process.env.NEXT_PUBLIC_APP_LOCALE;
  if (!locale?.length) {
    throw new AppClientError("Locale not provided in Env vars");
  }
  if (!["en-US", "ru-RU", "es-ES", "cn-CN"].includes(locale)) {
    throw new AppClientError("Unsupported locale");
  }

  return locale as AppLocale;
};
