import { ValueOf } from "@shared/ui/lib/types";

export const APP_ROUTES = {
  ADMINS: "ADMINS",
  CASES: "CASES",
  AUCTION: "AUCTION",
  AGENCY: "AGENCY",
  DEALS: "DEALS",
  HUNT: "HUNT",
} as const;

export const MAIN_ROUTES: AppRoute[] = [
  APP_ROUTES.AUCTION,
  APP_ROUTES.DEALS,
  APP_ROUTES.HUNT,
  APP_ROUTES.CASES,
];

export type AppRoute = ValueOf<typeof APP_ROUTES>;
export interface AppRouteConfig<T extends AppRoute> {
  key: T;
  label: string;
  href: string;
}

export const APP_ROUTES_CONFIG: Record<AppRoute, AppRouteConfig<AppRoute>> = {
  [APP_ROUTES.AUCTION]: {
    key: APP_ROUTES.AUCTION,
    label: "Auction",
    href: "/",
  },
  [APP_ROUTES.ADMINS]: {
    key: APP_ROUTES.ADMINS,
    label: "Admins",
    href: "/admin/admins",
  },
  [APP_ROUTES.CASES]: {
    key: APP_ROUTES.CASES,
    label: "Cases",
    href: "/admin/cases",
  },
  [APP_ROUTES.DEALS]: { key: APP_ROUTES.DEALS, label: "Deals", href: "/deals" },
  [APP_ROUTES.HUNT]: { key: APP_ROUTES.HUNT, label: "Hunt", href: "/hunt" },
  [APP_ROUTES.AGENCY]: {
    key: APP_ROUTES.AGENCY,
    label: "Agency",
    href: "/agency",
  },
};
