import {
  APP_LOCALE_TO_LANG_MAP,
  AppLocale,
  getAppURL,
} from "@shared/ui/lib/utils";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
// import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.host.startsWith("mhnt.")) {
    // means no language provided in subdomain
    const cookieStore = await cookies();
    const recentLocale = cookieStore.get("recent-locale");
    if (recentLocale) {
      return NextResponse.redirect(
        `${getAppURL(recentLocale.value as AppLocale | undefined)}${request.nextUrl.pathname}${request.nextUrl.search}`
      );
    }
  }

  const response = NextResponse.next();

  if (!request.nextUrl.host.startsWith("mhnt.")) {
    // means language provided in subdomain
    const cookieStore = await cookies();
    const recentLocale = cookieStore.get("recent-locale");
    const currentLangSubdomain = request.nextUrl.host.split(".")[0];
    if (
      currentLangSubdomain !==
      APP_LOCALE_TO_LANG_MAP[(recentLocale?.value ?? "en-US") as AppLocale]
    ) {
      let updatedLocale: AppLocale;
      switch (currentLangSubdomain) {
        case "es":
          updatedLocale = "es-ES";
          break;
        case "cn":
          updatedLocale = "cn-CN";
          break;
        case "ru":
          updatedLocale = "ru-RU";
          break;
        default:
          updatedLocale = "en-US";
      }

      response.cookies.set({
        name: "recent-locale",
        value: updatedLocale,
        httpOnly: true,
        secure: true,
      });
    }
  }

  // const sessionCookie = getSessionCookie(request);
  // Only for private routes
  // if (!sessionCookie) {
  //   return NextResponse.redirect(new URL("/signin", request.url));
  // }

  return response;
}

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};
