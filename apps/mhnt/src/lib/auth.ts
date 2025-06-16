import { prismaAdapter } from "better-auth/adapters/prisma";
import { prismaClient } from "./db";
import { betterAuth, BetterAuthPlugin } from "better-auth";
import { admin, magicLink, organization } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { sendEmail } from "@/actions/sendEmail";

export const auth = betterAuth({
  appName: "motherHunt",
  baseURL: "https://mhnt.local:3001",
  basePath: "/api/auth",
  database: prismaAdapter(prismaClient, {
    provider: "mongodb",
  }),
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await sendEmail({
          to: email,
          subject: "sign in",
          meta: {
            description: "You requested a sign in to mhnt.app",
            link: url,
          },
        });
      },
      expiresIn: 3600,
    }) as unknown as BetterAuthPlugin,
    admin() as unknown as BetterAuthPlugin,
    organization() as unknown as BetterAuthPlugin,
    nextCookies() as unknown as BetterAuthPlugin,
  ],
  // secondaryStorage: {},
  trustedOrigins: [
    "https://mhnt.local:3001",
    "https://mhnt.app",
    "https://motherhunt.com",
  ],
  // user: {
  //   modelName: "users",
  //   fields: {
  //     email: "email",
  //   },
  //   additionalFields: {
  //     customField: {
  //       type: "string",
  //     },
  //   },
  //   changeEmail: {
  //     enabled: true,
  //     sendChangeEmailVerification: async ({ user, newEmail, url, token }) => {
  //       // Send change email verification
  //     },
  //   },
  //   deleteUser: {
  //     enabled: true,
  //     sendDeleteAccountVerification: async ({ user, url, token }) => {
  //       // Send delete account verification
  //     },
  //     beforeDelete: async (user) => {
  //       // Perform actions before user deletion
  //     },
  //     afterDelete: async (user) => {
  //       // Perform cleanup after user deletion
  //     },
  //   },
  // },
});
