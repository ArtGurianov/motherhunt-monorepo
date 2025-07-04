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
import {
  APP_ROLES,
  APP_ROLES_CONFIG,
  appAccessControl,
} from "@/lib/auth/permissions/app-permissions";
import {
  AGENCY_ROLES,
  AGENCY_ROLES_CONFIG,
  agencyAccessControl,
} from "@/lib/auth/permissions/agency-permissions";
import { getAppURL, getSiteURL } from "@shared/ui/lib/utils";
import { getMemberRole } from "@/actions/getMemberRole";
import { OrganizationBeforeReviewMetadata } from "../utils/types";
import { sessionUpdateBefore } from "./dbHooks.ts/sessionUpdateBefore";

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
      creatorRole: AGENCY_ROLES.HEAD_BOOKER,
      allowUserToCreateOrganization: async (user) => {
        const userOrganizations = await prismaClient.member.findMany({
          where: { userId: user.id },
        });
        for (const each of userOrganizations) {
          const organizationData = await prismaClient.organization.findFirst({
            where: { id: each.organizationId },
          });
          if (
            !!organizationData?.metadata &&
            !JSON.parse(organizationData.metadata).reviewerId
          ) {
            return false;
          }
        }
        return true;
      },
      organizationCreation: {
        beforeCreate: async ({ organization, user }) => {
          return {
            data: {
              ...organization,
              metadata: {
                creatorId: user.id,
                creatorEmail: user.email,
              } as OrganizationBeforeReviewMetadata,
            },
          };
        },
        afterCreate: async ({ organization: { metadata } }) => {
          await sendEmail({
            to: metadata.creatorEmail,
            subject: "Organization Setup",
            meta: {
              description:
                "Your agency profile is created and currently under review",
              link: `${getAppURL()}/signin`,
            },
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
              session as unknown as {
                recentOrganizationId: string | null | undefined;
              }
            ).recentOrganizationId,
            activeOrganizationName: (
              session as unknown as {
                recentOrganizationName: string | null | undefined;
              }
            ).recentOrganizationName,
          },
        }),
      },
      update: { before: sessionUpdateBefore },
    },
  },
  // secondaryStorage: {},
  trustedOrigins: [getAppURL(), getSiteURL()],
  advanced: {
    database: { generateId: false },
    crossSubDomainCookies: {
      enabled: true,
      domain: `mhnt${process.env.NODE_ENV === "production" ? ".app" : ".local"}`,
    },
  },
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
      activeOrganizationName: {
        type: "string",
        required: false,
        input: false,
      },
      activeOrganizationRole: {
        type: "string",
        required: false,
        input: false,
      },
    },
  },
  user: {
    modelName: "user",
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ newEmail, url }) => {
        await sendEmail({
          to: newEmail,
          subject: "Change email",
          meta: {
            description: "You requested to change your email for mhnt.app",
            link: url,
          },
        });
      },
    },
    additionalFields: {
      role: {
        type: "string",
        input: false,
      },
      isSystemEmailsEnabled: {
        type: "boolean",
        input: false,
      },
      isNewsletterEmailsEnabled: {
        type: "boolean",
        input: false,
      },
      recentOrganizationId: {
        type: "string",
        required: false,
        input: false,
      },
      recentOrganizationName: {
        type: "string",
        required: false,
        input: false,
      },
    },
  },
} satisfies BetterAuthOptions;

export const auth = betterAuth({
  ...options,
  plugins: [
    ...(options.plugins ?? []),
    customSession(async ({ user, session }) => {
      const {
        id: userId,
        recentOrganizationId: activeOrganizationId,
        recentOrganizationName: activeOrganizationName,
      } = user;

      let activeOrganizationRole: string | null = null;
      if (activeOrganizationId) {
        activeOrganizationRole = await getMemberRole(
          userId,
          activeOrganizationId
        );
      }

      return {
        user,
        session: {
          ...session,
          ...(activeOrganizationId &&
          activeOrganizationName &&
          activeOrganizationRole
            ? {
                activeOrganizationId,
                activeOrganizationName,
                activeOrganizationRole,
              }
            : {}),
        },
      };
    }, options),
  ],
});
