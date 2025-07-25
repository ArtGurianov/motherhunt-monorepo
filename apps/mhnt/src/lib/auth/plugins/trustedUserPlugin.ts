import {
  BetterAuthError,
  CookieOptions,
  GenericEndpointContext,
  Session,
  type BetterAuthPlugin,
} from "better-auth";
import { createAuthEndpoint } from "better-auth/plugins";
import { APIError } from "better-auth/api";
import { base64Url } from "@better-auth/utils/base64";
import { createHMAC } from "@better-auth/utils/hmac";
import { z } from "zod";
import { User } from "@shared/db";

const getDate = (span: number, unit: "sec" | "ms" = "ms") => {
  return new Date(Date.now() + (unit === "sec" ? span * 1000 : span));
};

async function setCookieCache(
  ctx: GenericEndpointContext,
  session: {
    session: Session;
    user: User;
  }
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
      {} as Record<string, string | Date | null>
    );
    const sessionData = { session: filteredSession, user: session.user };
    const data = base64Url.encode(
      JSON.stringify({
        session: sessionData,
        expiresAt: getDate(
          ctx.context.authCookies.sessionData.options.maxAge || 60,
          "sec"
        ).getTime(),
        signature: await createHMAC("SHA-256", "base64urlnopad").sign(
          ctx.context.secret,
          JSON.stringify({
            ...sessionData,
            expiresAt: getDate(
              ctx.context.authCookies.sessionData.options.maxAge || 60,
              "sec"
            ).getTime(),
          })
        ),
      }),
      {
        padding: false,
      }
    );
    if (data.length > 4093) {
      throw new BetterAuthError(
        "Session data is too large to store in the cookie. Please disable session cookie caching or reduce the size of the session data"
      );
    }
    ctx.setCookie(
      ctx.context.authCookies.sessionData.name,
      data,
      ctx.context.authCookies.sessionData.options
    );
  }
}

async function setSessionCookie(
  ctx: GenericEndpointContext,
  session: {
    session: Session;
    user: User;
  },
  dontRememberMe?: boolean,
  overrides?: Partial<CookieOptions>
) {
  const dontRememberMeCookie = await ctx.getSignedCookie(
    ctx.context.authCookies.dontRememberToken.name,
    ctx.context.secret
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
    }
  );

  if (dontRememberMe) {
    await ctx.setSignedCookie(
      ctx.context.authCookies.dontRememberToken.name,
      "true",
      ctx.context.secret,
      ctx.context.authCookies.dontRememberToken.options
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
        (new Date(session.session.expiresAt).getTime() - Date.now()) / 1000
      )
    );
  }
}

interface TrustedUserPluginProps<TSchema extends z.Schema> {
  bodySchema: TSchema;
  getTrustedUser: (_: z.infer<TSchema>) => Promise<User | null>;
}

export const trustedUserPlugin = <T extends z.Schema>({
  bodySchema,
  getTrustedUser,
}: TrustedUserPluginProps<T>) => {
  return {
    id: "trusted-user-plugin",
    endpoints: {
      trustedUserSignIn: createAuthEndpoint(
        "/sign-in/trusted-user",
        {
          method: "POST",
          requireHeaders: true,
          body: bodySchema,
          metadata: {
            openapi: {
              description: "Trusted user Sign in plugin",
              responses: {
                200: {
                  description: "Success",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          status: {
                            type: "boolean",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        async (ctx) => {
          const trustedUser = await getTrustedUser(ctx.body as T);

          if (!trustedUser) {
            throw new APIError("FORBIDDEN", {
              message: "Failed to get trusted user data",
            });
          }

          const session = await ctx.context.internalAdapter.createSession(
            trustedUser.id,
            ctx
          );

          if (!session) {
            throw new APIError("INTERNAL_SERVER_ERROR", {
              message: "FAILED TO CREATE SESSION",
            });
          }

          await setSessionCookie(ctx, {
            session,
            user: trustedUser,
          });
          return ctx.json({
            token: session.token,
            user: {
              id: trustedUser.id,
              email: trustedUser.email,
              emailVerified: trustedUser.emailVerified,
              name: trustedUser.name,
              image: trustedUser.image,
              createdAt: trustedUser.createdAt,
              updatedAt: trustedUser.updatedAt,
              role: trustedUser.role,
            },
          });
        }
      ),
    },
    rateLimit: [
      {
        pathMatcher: (path) => {
          return path === "/sign-in/trusted-user";
        },
        max: 10,
        window: 60,
      },
    ],
  } satisfies BetterAuthPlugin;
};
