import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
// import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.host.startsWith("mhnt.")) {
    // means no language provided in subdomain
    const cookieStore = await cookies();
    const recentLangSubdomain = cookieStore.get("recent-lang");
    if (recentLangSubdomain) {
      return NextResponse.redirect(
        `https://${recentLangSubdomain}.${request.nextUrl.host}${request.nextUrl.pathname}${request.nextUrl.search}`
      );
    }
  }

  const response = NextResponse.next();

  if (!request.nextUrl.host.startsWith("mhnt.")) {
    // means language provided in subdomain
    const cookieStore = await cookies();
    const recentLangSubdomain = cookieStore.get("recent-lang");
    const currentLangSubdomain = request.nextUrl.host.split(".")[0];
    if (
      currentLangSubdomain &&
      currentLangSubdomain !== recentLangSubdomain?.value
    ) {
      response.cookies.set({
        name: "recent-lang",
        value: currentLangSubdomain,
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
