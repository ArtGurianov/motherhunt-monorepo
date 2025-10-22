import { base64Url } from "@better-auth/utils/base64";
import { createHMAC } from "@better-auth/utils/hmac";
import {
  BetterAuthError,
  CookieOptions,
  GenericEndpointContext,
  Session,
  User,
} from "better-auth";

export const getDate = (span: number, unit: "sec" | "ms" = "ms") => {
  return new Date(Date.now() + (unit === "sec" ? span * 1000 : span));
};

export async function setCookieCache(
  ctx: GenericEndpointContext,
  session: {
    session: Session;
    user: User;
  },
) {
  const shouldStoreSessionDataInCookie =
    ctx.context.options.session?.cookieCache?.enabled;

  if (shouldStoreSessionDataInCookie) {
    const filteredSession = Object.entries(session.session).reduce(
      (acc, [key, value]) => {
        const fieldConfig =
          ctx.context.options.session?.additionalFields?.[key];
        if (!fieldConfig || fieldConfig.returned !== false) {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, string | Date | null>,
    );
    const sessionData = { session: filteredSession, user: session.user };
    const data = base64Url.encode(
      JSON.stringify({
        session: sessionData,
        expiresAt: getDate(
          ctx.context.authCookies.sessionData.options.maxAge || 60,
          "sec",
        ).getTime(),
        signature: await createHMAC("SHA-256", "base64urlnopad").sign(
          ctx.context.secret,
          JSON.stringify({
            ...sessionData,
            expiresAt: getDate(
              ctx.context.authCookies.sessionData.options.maxAge || 60,
              "sec",
            ).getTime(),
          }),
        ),
      }),
      {
        padding: false,
      },
    );
    if (data.length > 4093) {
      throw new BetterAuthError(
        "Session data is too large to store in the cookie. Please disable session cookie caching or reduce the size of the session data",
      );
    }
    ctx.setCookie(
      ctx.context.authCookies.sessionData.name,
      data,
      ctx.context.authCookies.sessionData.options,
    );
  }
}

export async function setSessionCookie(
  ctx: GenericEndpointContext,
  session: {
    session: Session;
    user: User;
  },
  dontRememberMe?: boolean,
  overrides?: Partial<CookieOptions>,
) {
  const dontRememberMeCookie = await ctx.getSignedCookie(
    ctx.context.authCookies.dontRememberToken.name,
    ctx.context.secret,
  );
  // if dontRememberMe is not set, use the cookie value
  dontRememberMe =
    dontRememberMe !== undefined ? dontRememberMe : !!dontRememberMeCookie;

  const options = ctx.context.authCookies.sessionToken.options;
  const maxAge = dontRememberMe
    ? undefined
    : ctx.context.sessionConfig.expiresIn;
  await ctx.setSignedCookie(
    ctx.context.authCookies.sessionToken.name,
    session.session.token,
    ctx.context.secret,
    {
      ...options,
      maxAge,
      ...overrides,
    },
  );

  if (dontRememberMe) {
    await ctx.setSignedCookie(
      ctx.context.authCookies.dontRememberToken.name,
      "true",
      ctx.context.secret,
      ctx.context.authCookies.dontRememberToken.options,
    );
  }
  await setCookieCache(ctx, session);
  ctx.context.setNewSession(session);
  /**
   * If secondary storage is enabled, store the session data in the secondary storage
   * This is useful if the session got updated and we want to update the session data in the
   * secondary storage
   */
  if (ctx.context.options.secondaryStorage) {
    await ctx.context.secondaryStorage?.set(
      session.session.token,
      JSON.stringify({
        user: session.user,
        session: session.session,
      }),
      Math.floor(
        (new Date(session.session.expiresAt).getTime() - Date.now()) / 1000,
      ),
    );
  }
}
