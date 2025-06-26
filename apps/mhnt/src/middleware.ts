import {
  APP_LOCALE_TO_LANG_MAP,
  AppLocale,
  getAppURL,
} from "@shared/ui/lib/utils";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
// import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const cookieStore = await cookies();
  const recentLocale = cookieStore.get("recent-locale");

  if (
    request.nextUrl.host.startsWith("mhnt.") ||
    request.nextUrl.host.startsWith("www.mhnt.")
  ) {
    // means no language provided in subdomain
    if (recentLocale && recentLocale.value !== "en_US") {
      return NextResponse.redirect(
        `${getAppURL(recentLocale.value as AppLocale)}${request.nextUrl.pathname}${request.nextUrl.search}`
      );
    }
  } else {
    // language provided in subdomain
    const particles = request.nextUrl.host.split(".");
    const currentLangSubdomain =
      particles[0] === "www" ? particles[1] : particles[0];
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
        domain: "mhnt.app",
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
