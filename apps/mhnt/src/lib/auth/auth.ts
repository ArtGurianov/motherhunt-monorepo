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
import { getMemberRole } from "@/actions/getMemberRole";
import { getSession } from "@/actions/getSession";
import { AppClientError } from "@shared/ui/lib/utils/appClientError";

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
            headBookerEmail: metadata.headBookerEmail,
            headBookerId: metadata.headBookerId,
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
      update: {
        before: async (updateSessionData) => {
          const updateActiveOrganizationId = (
            updateSessionData as unknown as {
              activeOrganizationId: string | null | undefined;
            }
          ).activeOrganizationId;
          const oldSession = await getSession(updateSessionData.userId!);
          if (
            oldSession &&
            (!!oldSession.activeOrganizationId ||
              !!updateActiveOrganizationId) &&
            oldSession.activeOrganizationId !== updateActiveOrganizationId
          ) {
            let updateOrganizationName: string | null | undefined = null;
            let updateOrganizationRole: string | null | undefined = null;
            if (updateActiveOrganizationId) {
              try {
                const organization = await prismaClient.organization.findFirst({
                  where: { id: updateActiveOrganizationId },
                });
                if (!organization)
                  throw new AppClientError("Organization Not Found");
                updateOrganizationName = organization.name;

                updateOrganizationRole = await getMemberRole(
                  oldSession.userId,
                  organization.id
                );
                if (!updateOrganizationRole)
                  throw new AppClientError("Membership not found");
              } catch (e) {
                console.log(e);
              }
              await prismaClient.user.update({
                where: { id: oldSession.userId },
                data: {
                  recentOrganizationId: updateActiveOrganizationId,
                  recentOrganizationName: updateOrganizationName,
                },
              });
            }
            return {
              data: {
                ...oldSession,
                ...updateSessionData,
                ...(updateOrganizationName && updateOrganizationRole
                  ? {
                      activeOrganizationName: updateOrganizationName,
                      activeOrganizationRole: updateOrganizationRole,
                    }
                  : {}),
              },
            };
          }
          return true;
        },
      },
    },
  },
  // secondaryStorage: {},
  trustedOrigins: [getAppURL(), getSiteURL()],
  advanced: {
    database: { generateId: false },
    crossSubDomainCookies: {
      enabled: true,
      domain: ".mhnt.app",
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
      recentOrganizationName: {
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
      const activeOrganizationId = user.recentOrganizationId;
      const activeOrganizationName = user.recentOrganizationName;
      let activeOrganizationRole: string | null = null;

      if (activeOrganizationId) {
        activeOrganizationRole = await getMemberRole(
          user.id,
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
