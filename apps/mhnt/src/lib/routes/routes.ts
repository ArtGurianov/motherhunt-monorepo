import { ValueOf } from "@shared/ui/lib/types";

export const APP_ROUTES = {
  ADMINISTRATED: "ADMINISTRATED",
  SUPERADMINS: "SUPERADMINS",
  ADMINS: "ADMINS",
  CASES: "CASES",
  AGENCIES_APPLICATIONS: "AGENCIES_APPLICATIONS",
  AUCTION: "AUCTION",
  AGENCY_MANAGE: "AGENCY_MANAGE",
  AGENCY_DETAILS: "AGENCY_DETAILS",
  AGENCY_ACCEPT_INVITATION: "AGENCY_ACCEPT_INVITATION",
  DEALS: "DEALS",
  HUNT: "HUNT",
  AGENCY_APPLY: "AGENCY_APPLY",
  MODAL_SETTINGS: "MODAL_SETTINGS",
  MODAL_MY_AGENCIES: "MODAL_MY_AGENCIES",
  MODAL_MY_REQUESTS: "MODAL_MY_REQUESTS",
} as const;

export type AppRoute = ValueOf<typeof APP_ROUTES>;
export interface AppRouteConfig<T extends AppRoute> {
  key: T;
  href: string;
}

export const APP_ROUTES_CONFIG: Record<AppRoute, AppRouteConfig<AppRoute>> = {
  [APP_ROUTES.AUCTION]: {
    key: APP_ROUTES.AUCTION,
    href: "/",
  },
  [APP_ROUTES.ADMINISTRATED]: {
    key: APP_ROUTES.ADMINISTRATED,
    href: "/administrated",
  },
  [APP_ROUTES.SUPERADMINS]: {
    key: APP_ROUTES.SUPERADMINS,
    href: "/administrated/superadmins",
  },
  [APP_ROUTES.ADMINS]: {
    key: APP_ROUTES.ADMINS,
    href: "/administrated/admins",
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
    href: "/agency/accept-invitation/[id]",
  },
  [APP_ROUTES.AGENCY_APPLY]: {
    key: APP_ROUTES.AGENCY_APPLY,
    href: "/agency/apply",
  },
  [APP_ROUTES.MODAL_SETTINGS]: {
    key: APP_ROUTES.MODAL_SETTINGS,
    href: "/settings",
  },
  [APP_ROUTES.MODAL_MY_AGENCIES]: {
    key: APP_ROUTES.MODAL_MY_AGENCIES,
    href: "/settings/agency",
  },
  [APP_ROUTES.MODAL_MY_REQUESTS]: {
    key: APP_ROUTES.MODAL_MY_REQUESTS,
    href: "/settings/agency/requests",
  },
};
