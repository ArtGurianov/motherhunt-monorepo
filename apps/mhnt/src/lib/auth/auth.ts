import { prismaAdapter } from "better-auth/adapters/prisma";
import { prismaClient } from "../db";
import { betterAuth, BetterAuthPlugin } from "better-auth";
import {
  admin as adminPlugin,
  magicLink as magicLinkPlugin,
  organization as organizationPlugin,
} from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { sendEmail } from "@/actions/sendEmail";

import { initializeHeadBooker } from "@/actions/initializeHeadBooker";
import {
  APP_ROLES,
  APP_ROLES_CONFIG,
  appAccessControl,
} from "@/lib/auth/permissions/app-permissions";
import {
  AGENCY_ROLES_CONFIG,
  agencyAccessControl,
} from "@/lib/auth/permissions/agency-permissions";
import { getAppURL, getSiteURL } from "@shared/ui/lib/utils";

export const auth = betterAuth({
  appName: "motherHunt",
  baseURL: getAppURL(),
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
            description: "You requested a login to mhnt.app",
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
        afterCreate: async ({ organization: { metadata, id } }) => {
          await initializeHeadBooker({
            organizationId: id,
            userEmail: metadata.headBookerEmail,
            userName: metadata.headBookerName,
          });
        },
      },
    }) as unknown as BetterAuthPlugin,
    nextCookies() as unknown as BetterAuthPlugin,
  ],
  // secondaryStorage: {},
  trustedOrigins: [getAppURL(), getSiteURL()],
  advanced: { database: { generateId: false } },
  session: {
    modelName: "session",
    additionalFields: {
      role: {
        type: "string",
      },
    },
  },
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
