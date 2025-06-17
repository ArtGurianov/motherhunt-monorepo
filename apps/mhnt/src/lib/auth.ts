import { prismaAdapter } from "better-auth/adapters/prisma";
import { prismaClient } from "./db";
import { betterAuth, BetterAuthPlugin } from "better-auth";
import {
  admin as adminPlugin,
  magicLink as magicLinkPlugin,
  organization as organizationPlugin,
} from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { sendEmail } from "@/actions/sendEmail";
import {
  appAdminRole,
  appBookerRole,
  apphHeadBookerRole,
  appModeratorRole,
  appScouterRole,
} from "./permissions";

export const auth = betterAuth({
  appName: "motherHunt",
  baseURL: "https://mhnt.local:3001",
  basePath: "/api/auth",
  database: prismaAdapter(prismaClient, {
    provider: "mongodb",
  }),
  plugins: [
    magicLinkPlugin({
      sendMagicLink: async ({ email, url }) => {
        await sendEmail({
          to: email,
          subject: "Sign in",
          meta: {
            description: "You requested a login into mhnt.app",
            link: url,
          },
        });
      },
      expiresIn: 3600,
    }) as unknown as BetterAuthPlugin,
    adminPlugin({
      defaultRole: "scouter",
      roles: {
        appAdminRole,
        appModeratorRole,
        apphHeadBookerRole,
        appBookerRole,
        appScouterRole,
      },
    }) as unknown as BetterAuthPlugin,
    organizationPlugin() as unknown as BetterAuthPlugin,
    nextCookies() as unknown as BetterAuthPlugin,
  ],
  // secondaryStorage: {},
  trustedOrigins: [
    "https://mhnt.local:3001",
    "https://mhnt.app",
    "https://motherhunt.com",
  ],
  advanced: { database: { generateId: false } },
  user: {
    modelName: "user",
    additionalFields: {
      role: {
        type: "string",
      },
    },
    // changeEmail: {
    //   enabled: true,
    //   sendChangeEmailVerification: async ({ user, newEmail, url, token }) => {
    //     // Send change email verification
    //   },
    // },
    // deleteUser: {
    //   enabled: true,
    //   sendDeleteAccountVerification: async ({ user, url, token }) => {
    //     // Send delete account verification
    //   },
    //   beforeDelete: async (user) => {
    //     // Perform actions before user deletion
    //   },
    //   afterDelete: async (user) => {
    //     // Perform cleanup after user deletion
    //   },
    // },
  },
});
