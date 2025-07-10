import { ValueOf } from "@shared/ui/lib/types";

export const APP_ROUTES = {
  ADMINS: "ADMINS",
  CASES: "CASES",
  AGENCIES_APPLICATIONS: "AGENCIES_APPLICATIONS",
  AUCTION: "AUCTION",
  AGENCY: "AGENCY",
  DEALS: "DEALS",
  HUNT: "HUNT",
  AGENCY_APPLY: "AGENCY_APPLY",
  AGENCY_MANAGE: "AGENCY_MANAGE",
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
  [APP_ROUTES.ADMINS]: {
    key: APP_ROUTES.ADMINS,
    href: "/admin/admins",
  },
  [APP_ROUTES.CASES]: {
    key: APP_ROUTES.CASES,
    href: "/admin/cases",
  },
  [APP_ROUTES.AGENCIES_APPLICATIONS]: {
    key: APP_ROUTES.AGENCIES_APPLICATIONS,
    href: "/admin/cases/agencies",
  },
  [APP_ROUTES.DEALS]: { key: APP_ROUTES.DEALS, href: "/deals" },
  [APP_ROUTES.HUNT]: { key: APP_ROUTES.HUNT, href: "/hunt" },
  [APP_ROUTES.AGENCY]: {
    key: APP_ROUTES.AGENCY,
    href: "/agency",
  },
  [APP_ROUTES.AGENCY_APPLY]: {
    key: APP_ROUTES.AGENCY_APPLY,
    href: "/agency/apply",
  },
  [APP_ROUTES.AGENCY_MANAGE]: {
    key: APP_ROUTES.AGENCY_MANAGE,
    href: "/agency/manage",
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
