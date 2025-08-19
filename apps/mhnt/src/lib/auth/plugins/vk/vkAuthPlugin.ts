import { User, type BetterAuthPlugin } from "better-auth";
import { createAuthEndpoint } from "better-auth/plugins";
import z from "zod";
import { APIError } from "better-auth/api";
import { getEnvConfigServer } from "@/lib/config/env";
import { getAppURL } from "@shared/ui/lib/utils";
import { setSessionCookie } from "../utils";

const vkCodeResponseSchema = z.object({
  code: z.string(),
  state: z.string(),
  type: z.literal("code_v2"),
  device_id: z.string(),
});

const vkTokensResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  id_token: z.string(),
  expires_in: z.number(),
  user_id: z.number(),
  state: z.string(),
  scope: z.string(),
});

const vkUserResponseSchema = z.object({
  user: z.object({
    user_id: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    avatar: z.string(),
    email: z.string(),
    sex: z.number(),
    verified: z.boolean(),
    birthday: z.string(),
  }),
});

const generateAppModelEmail = (vkId: string) => `model${vkId}@mhnt.app`;

export const vkAuthPlugin = () => {
  return {
    id: "vk-plugin",
    schema: {
      user: {
        fields: {
          modelVkId: {
            type: "string",
            required: false,
            unique: false,
          },
        },
      },
    },
    endpoints: {
      vkSignIn: createAuthEndpoint(
        "/sign-in/vk",
        {
          method: "GET",
          metadata: {
            openapi: {
              description: "VK ID Sign in plugin",
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
          const codeValidationResult = vkCodeResponseSchema.safeParse(
            ctx.query
          );
          if (codeValidationResult.error) {
            throw new APIError("BAD_REQUEST", {
              message: "Received unexpected data shape from VK ID",
            });
          }

          let tokens: z.infer<typeof vkTokensResponseSchema> | null = null;
          try {
            const tokensResponse = await fetch(
              "https://id.vk.com/oauth2/auth",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  client_id: getEnvConfigServer().NEXT_PUBLIC_VK_CLIENT_ID,
                  grant_type: "authorization_code",
                  code_verifier: codeValidationResult.data.state,
                  device_id: codeValidationResult.data.device_id,
                  code: codeValidationResult.data.code,
                  redirect_uri: `${getAppURL()}/api/auth/sign-in/vk`,
                }),
              }
            );

            const tokensData = await tokensResponse.json();

            const tokensValidationResult =
              vkTokensResponseSchema.safeParse(tokensData);
            if (tokensValidationResult.error) throw new Error();
            tokens = tokensValidationResult.data;
          } catch {
            throw new APIError("INTERNAL_SERVER_ERROR", {
              message: "Error while exchanging for tokens with VK ID",
            });
          }

          if (!tokens)
            throw new APIError("INTERNAL_SERVER_ERROR", {
              message: "Did not receive tokens from VK ID",
            });

          let vkUser: z.infer<typeof vkUserResponseSchema> | null = null;
          try {
            const userResponse = await fetch(
              "https://id.vk.com/oauth2/user_info",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  client_id: getEnvConfigServer().NEXT_PUBLIC_VK_CLIENT_ID,
                  access_token: tokens.access_token,
                }),
              }
            );

            const userData = await userResponse.json();
            const userValidationResult =
              vkUserResponseSchema.safeParse(userData);

            if (userValidationResult.error) throw new Error();
            vkUser = userValidationResult.data;
          } catch {
            throw new APIError("INTERNAL_SERVER_ERROR", {
              message: "Error while getting user data from VK ID",
            });
          }

          if (!vkUser)
            throw new APIError("INTERNAL_SERVER_ERROR", {
              message: "Did not receive user data from VK ID",
            });

          const appModelEmail = generateAppModelEmail(vkUser.user.user_id);
          let user: User | null = null;
          try {
            const alreadyExists =
              await ctx.context.internalAdapter.findUserByEmail(appModelEmail);

            if (!alreadyExists) {
              user = await ctx.context.internalAdapter.createUser({
                name: `${vkUser.user.first_name} ${vkUser.user.last_name}`,
                email: appModelEmail,
                emailVerified: true,
                modelVkId: vkUser.user.user_id,
              });
            } else {
              user = alreadyExists.user;
            }
          } catch {
            throw new APIError("NOT_FOUND", {
              message: "Error while getting user data",
            });
          }

          if (!user)
            throw new APIError("NOT_FOUND", {
              message: "Error while getting user data",
            });

          const session = await ctx.context.internalAdapter.createSession(
            user.id,
            ctx
          );

          if (!session) {
            throw new APIError("INTERNAL_SERVER_ERROR", {
              message: "FAILED TO CREATE SESSION",
            });
          }

          await setSessionCookie(ctx, {
            session,
            user,
          });

          throw ctx.redirect("/");
        }
      ),
    },
    rateLimit: [
      {
        pathMatcher: (path) => {
          return path === "/sign-in/vk";
        },
        max: 10,
        window: 60,
      },
    ],
  } satisfies BetterAuthPlugin;
};
