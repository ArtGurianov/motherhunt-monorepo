import { prismaAdapter } from "better-auth/adapters/prisma";
import { prismaClient } from "../db";
import { betterAuth, BetterAuthOptions, BetterAuthPlugin } from "better-auth";
import {
  admin as adminPlugin,
  organization as organizationPlugin,
  captcha as captchaPlugin,
  magicLink as magicLinkPlugin,
  customSession as customSessionPlugin,
} from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { sendEmail } from "@/actions/sendEmail";
import {
  APP_ROLES,
  APP_ROLES_CONFIG,
  appAccessControl,
} from "@/lib/auth/permissions/app-permissions";
import {
  ORG_ROLES,
  ORG_ROLES_CONFIG,
  orgAccessControl,
} from "@/lib/auth/permissions/org-permissions";
import { getAppURL, getSiteURL, getAppLocale } from "@shared/ui/lib/utils";
import { getMemberRole } from "@/actions/getMemberRole";
import { sessionBeforeUpdate } from "./dbHooks/sessionBeforeUpdate";
import { sessionBeforeCreate } from "./dbHooks/sessionBeforeCreate";
import { getTranslations } from "next-intl/server";
import { inviteBooker } from "@/actions/inviteBooker";
import { getEnvConfigServer } from "../config/env";
import { trustedUserPlugin } from "./plugins/trustedUserPlugin";
import { getWeb3AdminUser } from "../web3/getWeb3AdminUser";
import { web3AdminRequestBodySchema } from "../schemas/web3AdminRequestBodySchema";
import { userAfterCreate } from "./dbHooks/userAfterCreate";

const envConfig = getEnvConfigServer();
const locale = getAppLocale();
const appURL = getAppURL(locale);
const t = await getTranslations({ locale, namespace: "EMAIL" });

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
      defaultRole: APP_ROLES.USER_ROLE,
      adminRoles: [
        APP_ROLES.MYDAOGS_ADMIN_ROLE,
        APP_ROLES.PROJECT_SUPERADMIN_ROLE,
        APP_ROLES.PROJECT_ADMIN_ROLE,
      ],
      roles: APP_ROLES_CONFIG,
    }),
    organizationPlugin({
      ac: orgAccessControl,
      roles: ORG_ROLES_CONFIG,
      creatorRole: ORG_ROLES.OWNER_ROLE,
      sendInvitationEmail: inviteBooker,
    }) as unknown as BetterAuthPlugin,
    nextCookies() as unknown as BetterAuthPlugin,
  ],
  databaseHooks: {
    session: {
      create: {
        before: sessionBeforeCreate,
      },
      update: { before: sessionBeforeUpdate },
    },
    user: {
      create: { after: userAfterCreate },
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
      activeOrganizationType: {
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
      scoutingOrganizationId: {
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
      recentOrganizationType: {
        type: "string",
        required: false,
        input: false,
      },
      modelSocialId: {
        type: "string",
        required: false,
        input: false,
      },
      modelOrganizationId: {
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
    customSessionPlugin(async ({ user, session }) => {
      const {
        id,
        recentOrganizationId: activeOrganizationId,
        recentOrganizationName: activeOrganizationName,
        recentOrganizationType: activeOrganizationType,
      } = user;

      let membership: { role: string; memberId: string } | null = null;
      if (activeOrganizationId) {
        const result = await getMemberRole({
          userId: id,
          organizationId: activeOrganizationId,
        });
        if (result.success) {
          membership = result.data;
        }
      }

      return {
        user,
        session: {
          ...session,
          ...(activeOrganizationId && activeOrganizationName && membership
            ? {
                activeOrganizationId,
                activeOrganizationName,
                activeOrganizationType,
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
