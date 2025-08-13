import { type BetterAuthPlugin } from "better-auth";
import { createAuthEndpoint } from "better-auth/plugins";
import { APIError } from "better-auth/api";
import { z } from "zod";
import { User } from "@shared/db";
import { setSessionCookie } from "./utils";

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
