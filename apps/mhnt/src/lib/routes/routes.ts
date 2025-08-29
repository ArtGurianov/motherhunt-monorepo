import { ValueOf } from "@shared/ui/lib/types";

export const APP_ROUTES = {
  SIGN_IN: "SIGN_IN",
  SIGN_IN_ADMIN: "SIGN_IN_ADMIN",
  REDIRECT_FROM_VK: "REDIRECT_FROM_VK",
  ADMINISTRATED: "ADMINISTRATED",
  SUPERADMINS: "SUPERADMINS",
  SUPERADMIN_DETAILS: "SUPERADMIN_DETAILS",
  ADMINS: "ADMINS",
  ADMIN_DETAILS: "ADMIN_DETAILS",
  CASES: "CASES",
  AGENCIES_APPLICATIONS: "AGENCIES_APPLICATIONS",
  AUCTION: "AUCTION",
  LOT: "LOT",
  AGENCY_MANAGE: "AGENCY_MANAGE",
  AGENCY_DETAILS: "AGENCY_DETAILS",
  AGENCY_ACCEPT_INVITATION: "AGENCY_ACCEPT_INVITATION",
  DEALS: "DEALS",
  HUNT: "HUNT",
  DRAFTS: "DRAFTS",
  MODEL_CONFIRMATION: "MODEL_CONFIRMATION",
  AGENCY_APPLY: "AGENCY_APPLY",
  MODAL_SETTINGS: "MODAL_SETTINGS",
  MODAL_SWITCH: "MODAL_SWITCH",
  MODAL_SWITCH_AGENCY: "MODAL_SWITCH_AGENCY",
  MODAL_SWITCH_MODEL: "MODAL_SWITCH_MODEL",
  MODAL_SWITCH_AGENCY_REQUESTS: "MODAL_SWITCH_AGENCY_REQUESTS",
} as const;

export type AppRoute = ValueOf<typeof APP_ROUTES>;
export interface AppRouteConfig<T extends AppRoute> {
  key: T;
  href: string;
}

function defineRoutes<T extends Record<AppRoute, AppRouteConfig<AppRoute>>>(
  routes: T
) {
  return routes;
}

export const APP_ROUTES_CONFIG = defineRoutes({
  [APP_ROUTES.SIGN_IN]: {
    key: APP_ROUTES.SIGN_IN,
    href: "/sign-in",
  },
  [APP_ROUTES.SIGN_IN_ADMIN]: {
    key: APP_ROUTES.SIGN_IN_ADMIN,
    href: "/sign-in/admin",
  },
  [APP_ROUTES.REDIRECT_FROM_VK]: {
    key: APP_ROUTES.REDIRECT_FROM_VK,
    href: "/sign-in/vk",
  },
  [APP_ROUTES.AUCTION]: {
    key: APP_ROUTES.AUCTION,
    href: "/",
  },
  [APP_ROUTES.LOT]: {
    key: APP_ROUTES.LOT,
    href: "/auction/[lotId]",
  },
  [APP_ROUTES.ADMINISTRATED]: {
    key: APP_ROUTES.ADMINISTRATED,
    href: "/administrated",
  },
  [APP_ROUTES.SUPERADMINS]: {
    key: APP_ROUTES.SUPERADMINS,
    href: "/administrated/superadmins",
  },
  [APP_ROUTES.SUPERADMIN_DETAILS]: {
    key: APP_ROUTES.SUPERADMIN_DETAILS,
    href: "/administrated/superadmins/[address]",
  },
  [APP_ROUTES.ADMINS]: {
    key: APP_ROUTES.ADMINS,
    href: "/administrated/admins",
  },
  [APP_ROUTES.ADMIN_DETAILS]: {
    key: APP_ROUTES.ADMIN_DETAILS,
    href: "/administrated/admins/[address]",
  },
  [APP_ROUTES.CASES]: {
    key: APP_ROUTES.CASES,
    href: "/administrated/cases",
  },
  [APP_ROUTES.AGENCIES_APPLICATIONS]: {
    key: APP_ROUTES.AGENCIES_APPLICATIONS,
    href: "/administrated/cases/agencies",
  },
  [APP_ROUTES.DEALS]: { key: APP_ROUTES.DEALS, href: "/deals" },
  [APP_ROUTES.HUNT]: { key: APP_ROUTES.HUNT, href: "/hunt" },
  [APP_ROUTES.DRAFTS]: { key: APP_ROUTES.DRAFTS, href: "/hunt/drafts" },
  [APP_ROUTES.MODEL_CONFIRMATION]: {
    key: APP_ROUTES.MODEL_CONFIRMATION,
    href: "/confirmation/[id]",
  },
  [APP_ROUTES.AGENCY_MANAGE]: {
    key: APP_ROUTES.AGENCY_MANAGE,
    href: "/agency",
  },
  [APP_ROUTES.AGENCY_DETAILS]: {
    key: APP_ROUTES.AGENCY_DETAILS,
    href: "/agency/[slug]",
  },
  [APP_ROUTES.AGENCY_ACCEPT_INVITATION]: {
    key: APP_ROUTES.AGENCY_ACCEPT_INVITATION,
    href: "/agency/accept-invitation/[agencyId]",
  },
  [APP_ROUTES.AGENCY_APPLY]: {
    key: APP_ROUTES.AGENCY_APPLY,
    href: "/agency/apply",
  },
  [APP_ROUTES.MODAL_SETTINGS]: {
    key: APP_ROUTES.MODAL_SETTINGS,
    href: "/settings",
  },
  [APP_ROUTES.MODAL_SWITCH]: {
    key: APP_ROUTES.MODAL_SWITCH,
    href: "/settings/switch-account",
  },
  [APP_ROUTES.MODAL_SWITCH_AGENCY]: {
    key: APP_ROUTES.MODAL_SWITCH_AGENCY,
    href: "/settings/switch-account/agency",
  },
  [APP_ROUTES.MODAL_SWITCH_AGENCY_REQUESTS]: {
    key: APP_ROUTES.MODAL_SWITCH_AGENCY_REQUESTS,
    href: "/settings/switch-account/agency/requests",
  },
  [APP_ROUTES.MODAL_SWITCH_MODEL]: {
    key: APP_ROUTES.MODAL_SWITCH_MODEL,
    href: "/settings/switch-account/model",
  },
} as const);
