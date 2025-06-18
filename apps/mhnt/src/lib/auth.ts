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
  appAccessControl,
  agencyAccessControl,
  APP_ROLES_CONFIG,
  AGENCY_ROLES_CONFIG,
  APP_ROLES,
} from "./permissions";
import { isActiveAdmin } from "@/actions/isActiveAdmin";
import { createHeadBooker } from "@/actions/createHeadBooker";

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
      ac: appAccessControl,
      defaultRole: APP_ROLES.SCOUTER,
      adminRoles: [APP_ROLES.SUPER_ADMIN, APP_ROLES.ADMIN],
      roles: APP_ROLES_CONFIG,
    }),
    organizationPlugin({
      ac: agencyAccessControl,
      roles: AGENCY_ROLES_CONFIG,
      organizationCreation: {
        beforeCreate: async ({ organization: { metadata, ...data } }) => {
          await createHeadBooker({
            userEmail: metadata.headBookerEmail,
            userName: metadata.headBookerName,
          });
          await sendEmail({
            to: metadata.headBookerEmail,
            subject: "Organization Setup",
            meta: {
              description:
                "Your agency is approved. You can now login and start hunting!",
              link: `https://mhnt.app/signin`,
            },
          });
          return {
            data,
          };
        },
      },
      allowUserToCreateOrganization: async (user) => {
        return await isActiveAdmin(user.id);
      },
    }) as unknown as BetterAuthPlugin,
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
