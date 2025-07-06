import { createHMAC } from "@better-auth/utils/hmac";
import { APIError } from "./apiError";

function parseCookies(cookieHeader: string) {
  const cookies = cookieHeader.split("; ");
  const cookieMap = new Map<string, string>();

  cookies.forEach((cookie) => {
    const [name, value] = cookie.split("=");
    cookieMap.set(name!, value!);
  });
  return cookieMap;
}

const getSessionCookie = (
  request: Request | Headers,
  config?: {
    cookiePrefix?: string;
    cookieName?: string;
    path?: string;
  }
) => {
  if (config?.cookiePrefix) {
    if (config.cookieName) {
      config.cookiePrefix = `${config.cookiePrefix}-`;
    } else {
      config.cookiePrefix = `${config.cookiePrefix}.`;
    }
  }
  const headers = "headers" in request ? request.headers : request;
  const cookies = headers.get("cookie");
  if (!cookies) {
    return null;
  }
  const { cookieName = "session_token", cookiePrefix = "better-auth." } =
    config || {};
  const name = `${cookiePrefix}${cookieName}`;
  const secureCookieName = `__Secure-${name}`;
  const parsedCookie = parseCookies(cookies);
  const sessionToken =
    parsedCookie.get(name) || parsedCookie.get(secureCookieName);
  if (sessionToken) {
    return sessionToken;
  }

  return null;
};

export const getSessionToken = async (
  request: Request | Headers,
  config?: {
    cookiePrefix?: string;
    cookieName?: string;
    path?: string;
  }
) => {
  const token = getSessionCookie(request, config);
  if (!token)
    throw new APIError("UNAUTHORIZED", { message: "Session token not found" });
  const decodedToken = decodeURIComponent(token);
  const isValid = await createHMAC("SHA-256", "base64urlnopad").verify(
    process.env.BETTER_AUTH_SECRET!,
    decodedToken.split(".")[0]!,
    decodedToken.split(".")[1]!
  );
  if (!isValid) {
    throw new APIError("UNAUTHORIZED", { message: "Invalid session token" });
  }
  return decodedToken.split(".")[0];
};
