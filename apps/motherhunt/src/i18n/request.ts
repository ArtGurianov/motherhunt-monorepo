import { getRequestConfig } from "next-intl/server";
import { AppClientError } from "@shared/ui/lib/utils/appClientError";

export default getRequestConfig(async () => {
  const locale = process.env.NEXT_PUBLIC_APP_LOCALE;
  if (!locale?.length) {
    throw new AppClientError("Locale not provided in Env vars");
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
