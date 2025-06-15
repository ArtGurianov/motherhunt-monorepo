import { ValueOf } from "@/lib/types";

export const APP_ROUTE_IDS = {
  HOME: "HOME",
  GUIDES: "GUIDES",
  BLOG: "BLOG",
  FAQ: "FAQ",
} as const;
export type AppRouteId = ValueOf<typeof APP_ROUTE_IDS>;

export const ROUTER_CONFIG: Record<
  AppRouteId,
  {
    routeId: AppRouteId;
    urlPath: string;
    routerPath: string;
  }
> = {
  [APP_ROUTE_IDS.HOME]: {
    routeId: APP_ROUTE_IDS.HOME,
    urlPath: "/",
    routerPath: "/",
  },
  [APP_ROUTE_IDS.GUIDES]: {
    routeId: APP_ROUTE_IDS.GUIDES,
    urlPath: "/guides",
    routerPath: "/guides",
  },
  [APP_ROUTE_IDS.BLOG]: {
    routeId: APP_ROUTE_IDS.BLOG,
    urlPath: "/blog",
    routerPath: "/blog",
  },
  [APP_ROUTE_IDS.FAQ]: {
    routeId: APP_ROUTE_IDS.FAQ,
    urlPath: "/faq",
    routerPath: "/faq",
  },
};
