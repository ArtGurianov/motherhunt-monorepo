import { prismaAdapter } from "better-auth/adapters/prisma";
import { prismaClient } from "../db";
import { betterAuth, BetterAuthOptions, BetterAuthPlugin } from "better-auth";
import {
  admin as adminPlugin,
  organization as organizationPlugin,
  captcha as captchaPlugin,
  magicLink as magicLinkPlugin,
  customSession,
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

const options = {
  appName: "motherHunt",
  baseURL: getAppURL(),
  basePath: "/api/auth",
  database: prismaAdapter(prismaClient, {
    provider: "mongodb",
  }),
  plugins: [
    captchaPlugin({
      provider: "hcaptcha",
      secretKey: process.env.HCAPTCHA_SECRET_KEY!,
      endpoints: ["sign-in/magic-link"],
    }),
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
  databaseHooks: {
    session: {
      create: {
        before: async (session) => ({
          data: {
            ...session,
            activeOrganizationId: (
              session as unknown as { recentOrganizationId: string }
            ).recentOrganizationId,
          },
        }),
      },
    },
  },
  // secondaryStorage: {},
  trustedOrigins: [getAppURL(), getSiteURL()],
  advanced: { database: { generateId: false } },
  session: {
    modelName: "session",
    additionalFields: {
      role: {
        type: "string",
        input: false,
      },
      activeOrganizationId: {
        type: "string",
        required: false,
        input: false,
      },
      recentOrganizationId: {
        type: "string",
        required: false,
        input: false,
      },
    },
  },
  user: {
    modelName: "user",
    additionalFields: {
      role: {
        type: "string",
        input: false,
      },
      recentOrganizationId: {
        type: "string",
        required: false,
        input: false,
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
} satisfies BetterAuthOptions;

export const auth = betterAuth({
  ...options,
  plugins: [
    ...(options.plugins ?? []),
    customSession(async ({ user, session }) => {
      return {
        user,
        session: {
          ...session,
          recentOrganizationId: (
            user as unknown as { recentOrganizationId: string }
          ).recentOrganizationId,
        },
      };
    }, options),
  ],
});
