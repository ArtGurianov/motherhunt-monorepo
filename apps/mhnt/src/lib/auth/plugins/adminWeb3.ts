import { viemClient } from "@/lib/web3/viemClient";
import {
  BetterAuthError,
  CookieOptions,
  GenericEndpointContext,
  Session,
  User,
  type BetterAuthPlugin,
} from "better-auth";
import { createAuthEndpoint } from "better-auth/plugins";
import { APIError } from "../apiError";
import { systemContractAbi } from "@/lib/web3/abi";
import { getEnvConfigServer } from "@/lib/config/env";
import { base64Url } from "@better-auth/utils/base64";
import { createHMAC } from "@better-auth/utils/hmac";
import { APP_ROLES } from "../permissions/app-permissions";
import { z } from "zod";
import { ValueOf } from "@shared/ui/lib/types";

const WEB3_ADMIN_ACCESS_ROLES = {
  _NOT_AN_ADMIN: "_NOT_AN_ADMIN",
  MYDAOGS_ADMIN_ROLE: "MYDAOGS_ADMIN_ROLE",
  PROJECT_SUPERADMIN_ROLE: "PROJECT_SUPERADMIN_ROLE",
  PROJECT_ADMIN_ROLE: "PROJECT_ADMIN_ROLE",
} as const;

const MapWeb3AdminRoles: Record<
  number,
  ValueOf<typeof WEB3_ADMIN_ACCESS_ROLES>
> = {
  0: WEB3_ADMIN_ACCESS_ROLES._NOT_AN_ADMIN,
  1: WEB3_ADMIN_ACCESS_ROLES.MYDAOGS_ADMIN_ROLE,
  2: WEB3_ADMIN_ACCESS_ROLES.PROJECT_SUPERADMIN_ROLE,
  3: WEB3_ADMIN_ACCESS_ROLES.PROJECT_ADMIN_ROLE,
} as const;

const web3RoleValidator = z
  .number()
  .transform((value) => MapWeb3AdminRoles[value]);

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

export const adminWeb3Plugin = () => {
  return {
    id: "admin-web3-plugin",
    endpoints: {
      adminWeb3SignIn: createAuthEndpoint(
        "/sign-in/admin-web3",
        {
          method: "POST",
          requireHeaders: true,
          body: z.object({
            signature: z
              .string({
                description: "Login request signed with private key",
              })
              .startsWith("0x"),
            address: z
              .string({
                description: "Address of signer wallet",
              })
              .startsWith("0x"),
          }),
          metadata: {
            openapi: {
              description: "Sign in with web3 wallet",
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
          const { signature, address } = ctx.body;

          const isValidSignature = await viemClient.verifyMessage({
            address: address as `0x${string}`,
            message: "sign-in",
            signature: signature as `0x${string}`,
          });
          if (!isValidSignature)
            throw new APIError("FORBIDDEN", {
              message: "Invalid signature",
            });

          const getRoleByAddressResult = await viemClient.readContract({
            abi: systemContractAbi,
            address: getEnvConfigServer()
              .NEXT_PUBLIC_SYSTEM_CONTRACT_ADDRESS as `0x${string}`,
            functionName: "getRoleByAddress",
            args: [address as `0x${string}`],
          });

          const parsedRole = web3RoleValidator.safeParse(
            getRoleByAddressResult
          );

          if (parsedRole.error)
            throw new APIError("INTERNAL_SERVER_ERROR", {
              message: "Role parsing error",
            });

          if (parsedRole.data === "_NOT_AN_ADMIN")
            throw new APIError("FORBIDDEN", {
              message: "Not an admin",
            });

          let adminUser: User | null = null;
          if (parsedRole.data === "MYDAOGS_ADMIN_ROLE") {
            adminUser = await ctx.context.adapter.findOne({
              model: "user",
              where: [{ field: "role", value: APP_ROLES.MYDAOGS_ADMIN_ROLE }],
            });
          } else if (parsedRole.data === "PROJECT_SUPERADMIN_ROLE") {
            adminUser = await ctx.context.adapter.findOne({
              model: "user",
              where: [
                { field: "role", value: APP_ROLES.PROJECT_SUPERADMIN_ROLE },
              ],
            });
          } else if (parsedRole.data === "PROJECT_ADMIN_ROLE") {
            adminUser = await ctx.context.adapter.findOne({
              model: "user",
              where: [{ field: "role", value: APP_ROLES.PROJECT_ADMIN_ROLE }],
            });
          }

          if (!adminUser) {
            throw new APIError("FORBIDDEN", {
              message: "Failed to assign admin role",
            });
          }

          const session = await ctx.context.internalAdapter.createSession(
            adminUser.id,
            ctx
          );

          if (!session) {
            throw new APIError("INTERNAL_SERVER_ERROR", {
              message: "FAILED TO CREATE SESSION",
            });
          }

          await setSessionCookie(ctx, {
            session,
            user: adminUser,
          });
          return ctx.json({
            token: session.token,
            user: {
              id: adminUser.id,
              email: adminUser.email,
              emailVerified: adminUser.emailVerified,
              name: adminUser.name,
              image: adminUser.image,
              createdAt: adminUser.createdAt,
              updatedAt: adminUser.updatedAt,
              role: parsedRole.data,
            },
          });
        }
      ),
    },
    rateLimit: [
      {
        pathMatcher: (path) => {
          return path === "/sign-in/admin";
        },
        max: 10,
        window: 60,
      },
    ],
  } satisfies BetterAuthPlugin;
};
