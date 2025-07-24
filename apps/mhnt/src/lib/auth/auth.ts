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
import { getAppURL, getSiteURL, getAppLocale } from "@shared/ui/lib/utils";
import { getMemberRole } from "@/actions/getMemberRole";
import { sessionUpdateBefore } from "./dbHooks/sessionUpdateBefore";
import { getTranslations } from "next-intl/server";
import { inviteBooker } from "@/actions/inviteBooker";
import { getEnvConfigServer } from "../config/env";
import { trustedUserPlugin } from "./plugins/trustedUserPlugin";
import { getWeb3AdminUser } from "../web3/getWeb3AdminUser";
import { z } from "zod";

const envConfig = getEnvConfigServer();
const locale = getAppLocale();
const appURL = getAppURL(locale);
const t = await getTranslations({ locale, namespace: "EMAIL" });

export const web3AdminRequestBodySchema = z.object({
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
});

const options = {
  appName: "motherHunt",
  baseURL: appURL,
  basePath: "/api/auth",
  database: prismaAdapter(prismaClient, {
    provider: "mongodb",
  }),
  plugins: [
    captchaPlugin({
      provider: "hcaptcha",
      secretKey:
        envConfig.NODE_ENV === "production"
          ? envConfig.HCAPTCHA_SECRET_KEY
          : "0x0000000000000000000000000000000000000000",
      endpoints: ["sign-in/magic-link"],
    }),
    magicLinkPlugin({
      sendMagicLink: async ({ email, url }) => {
        await sendEmail({
          to: email,
          subject: t("magic-link-subject"),
          meta: {
            description: t("magic-link-description"),
            link: url,
          },
        });
      },
      expiresIn: 3600,
    }) as unknown as BetterAuthPlugin,
    trustedUserPlugin({
      getTrustedUser: getWeb3AdminUser,
      bodySchema: web3AdminRequestBodySchema,
    }),
    adminPlugin({
      ac: appAccessControl,
      defaultRole: APP_ROLES.SCOUTER_ROLE,
      adminRoles: [
        APP_ROLES.MYDAOGS_ADMIN_ROLE,
        APP_ROLES.PROJECT_SUPERADMIN_ROLE,
        APP_ROLES.PROJECT_ADMIN_ROLE,
      ],
      roles: APP_ROLES_CONFIG,
    }),
    organizationPlugin({
      ac: agencyAccessControl,
      roles: AGENCY_ROLES_CONFIG,
      creatorRole: AGENCY_ROLES.HEAD_BOOKER_ROLE,
      sendInvitationEmail: inviteBooker,
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
  trustedOrigins: [appURL, getSiteURL()],
  advanced: {
    database: { generateId: false },
    crossSubDomainCookies: {
      enabled: true,
      domain: envConfig.NODE_ENV === "production" ? "mhnt.app" : "localhost",
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
      activeMemberId: {
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
          subject: t("change-email-subject"),
          meta: {
            description: t("change-email-description"),
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

const auth = betterAuth({
  ...options,
  plugins: [
    ...(options.plugins ?? []),
    customSession(async ({ user, session }) => {
      const {
        id,
        recentOrganizationId: activeOrganizationId,
        recentOrganizationName: activeOrganizationName,
      } = user;

      let membership: { role: string; memberId: string } | null = null;
      if (activeOrganizationId) {
        membership = await getMemberRole({
          userId: id,
          organizationId: activeOrganizationId,
        });
      }

      return {
        user,
        session: {
          ...session,
          ...(activeOrganizationId && activeOrganizationName && membership
            ? {
                activeOrganizationId,
                activeOrganizationName,
                activeOrganizationRole: membership.role,
                activeMemberId: membership.memberId,
              }
            : {
                activeOrganizationId: null,
                activeOrganizationName: null,
                activeOrganizationRole: null,
                activeMemberId: null,
              }),
        },
      };
    }, options),
  ],
});

type ExtendedAuth = typeof auth & {
  api: (typeof auth)["api"] & {
    createOrganization: ({
      body,
    }: {
      body: {
        name: string;
        slug: string;
        logo: string;
        metadata: Record<string, string>;
        userId: string;
        keepCurrentOrganization: boolean;
      };
    }) => Promise<void>;
    hasPermission(props: {
      headers: Headers;
      body: {
        organizationId: string;
        permissions: Record<string, string[]>;
      };
      /* eslint-disable @typescript-eslint/no-explicit-any */
    }): { error: any; success: boolean };
  };
};

export default auth as ExtendedAuth;
