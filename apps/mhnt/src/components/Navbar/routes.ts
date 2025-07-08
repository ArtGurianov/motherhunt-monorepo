import { ValueOf } from "@shared/ui/lib/types";
import {
  AdminSvgUrl,
  AgencySvgUrl,
  CaseSvgUrl,
  DealSvgUrl,
  HuntSvgUrl,
  LookSvgUrl,
} from "../Svg";
import { APP_ROLES, AppRole } from "@/lib/auth/permissions/app-permissions";
import {
  AGENCY_ROLES,
  AgencyRole,
} from "@/lib/auth/permissions/agency-permissions";

export const NAV_ROUTES = {
  ADMINS: "ADMINS",
  CASES: "CASES",
  AUCTION: "AUCTION",
  AGENCY: "AGENCY",
  DEALS: "DEALS",
  HUNT: "HUNT",
} as const;
export type NavRoute = ValueOf<typeof NAV_ROUTES>;

export const SUPER_ADMIN_NAV_ROUTES_ORDER = [
  NAV_ROUTES.AUCTION,
  NAV_ROUTES.ADMINS,
  NAV_ROUTES.CASES,
] as const;
export const ADMIN_NAV_ROUTES_ORDER = [NAV_ROUTES.CASES] as const;
export const SCOUTER_NAV_ROUTES_ORDER = [
  NAV_ROUTES.AUCTION,
  NAV_ROUTES.HUNT,
  NAV_ROUTES.DEALS,
] as const;
export const HEAD_BOOKER_NAV_ROUTES_ORDER = [
  NAV_ROUTES.AUCTION,
  NAV_ROUTES.AGENCY,
  NAV_ROUTES.DEALS,
] as const;
export const BOOKER_NAV_ROUTES_ORDER = [NAV_ROUTES.AUCTION] as const;

export const NAV_ROUTES_ORDERS = {
  [APP_ROLES.SUPER_ADMIN]: SUPER_ADMIN_NAV_ROUTES_ORDER,
  [APP_ROLES.ADMIN]: ADMIN_NAV_ROUTES_ORDER,
  [APP_ROLES.SCOUTER]: SCOUTER_NAV_ROUTES_ORDER,
  [AGENCY_ROLES.HEAD_BOOKER]: HEAD_BOOKER_NAV_ROUTES_ORDER,
  [AGENCY_ROLES.BOOKER]: BOOKER_NAV_ROUTES_ORDER,
} satisfies Record<AppRole | AgencyRole, readonly NavRoute[]>;

export interface NavConfigItem<T extends NavRoute> {
  key: T;
  label: string;
  href: string;
  svgPath: string;
}

export const SUPER_ADMIN_NAV_CONFIG: Record<
  (typeof SUPER_ADMIN_NAV_ROUTES_ORDER)[number],
  NavConfigItem<(typeof SUPER_ADMIN_NAV_ROUTES_ORDER)[number]>
> = {
  [NAV_ROUTES.AUCTION]: {
    key: NAV_ROUTES.AUCTION,
    label: "Auction",
    href: "/",
    svgPath: LookSvgUrl,
  },
  [NAV_ROUTES.ADMINS]: {
    key: NAV_ROUTES.ADMINS,
    label: "Admins",
    href: "/admin/admins",
    svgPath: AdminSvgUrl,
  },
  [NAV_ROUTES.CASES]: {
    key: NAV_ROUTES.CASES,
    label: "Cases",
    href: "/admin/cases",
    svgPath: CaseSvgUrl,
  },
};

export const ADMIN_NAV_CONFIG: Record<
  (typeof ADMIN_NAV_ROUTES_ORDER)[number],
  NavConfigItem<(typeof ADMIN_NAV_ROUTES_ORDER)[number]>
> = {
  [NAV_ROUTES.CASES]: {
    key: NAV_ROUTES.CASES,
    label: "Cases",
    href: "/admin/cases",
    svgPath: CaseSvgUrl,
  },
};

export const SCOUTER_NAV_CONFIG: Record<
  (typeof SCOUTER_NAV_ROUTES_ORDER)[number],
  NavConfigItem<(typeof SCOUTER_NAV_ROUTES_ORDER)[number]>
> = {
  [NAV_ROUTES.AUCTION]: {
    key: NAV_ROUTES.AUCTION,
    label: "Auction",
    href: "/",
    svgPath: LookSvgUrl,
  },
  [NAV_ROUTES.DEALS]: {
    key: NAV_ROUTES.DEALS,
    label: "Deals",
    href: "/deals",
    svgPath: DealSvgUrl,
  },
  [NAV_ROUTES.HUNT]: {
    key: NAV_ROUTES.HUNT,
    label: "Hunt",
    href: "/hunt",
    svgPath: HuntSvgUrl,
  },
};

export const HEAD_BOOKER_NAV_CONFIG: Record<
  (typeof HEAD_BOOKER_NAV_ROUTES_ORDER)[number],
  NavConfigItem<(typeof HEAD_BOOKER_NAV_ROUTES_ORDER)[number]>
> = {
  [NAV_ROUTES.AUCTION]: {
    key: NAV_ROUTES.AUCTION,
    label: "Auction",
    href: "/auction",
    svgPath: LookSvgUrl,
  },
  [NAV_ROUTES.DEALS]: {
    key: NAV_ROUTES.DEALS,
    label: "Deals",
    href: "/deals",
    svgPath: DealSvgUrl,
  },
  [NAV_ROUTES.AGENCY]: {
    key: NAV_ROUTES.AGENCY,
    label: "Agency",
    href: "/agency",
    svgPath: AgencySvgUrl,
  },
};

export const BOOKER_NAV_CONFIG: Record<
  (typeof BOOKER_NAV_ROUTES_ORDER)[number],
  NavConfigItem<(typeof BOOKER_NAV_ROUTES_ORDER)[number]>
> = {
  [NAV_ROUTES.AUCTION]: {
    key: NAV_ROUTES.AUCTION,
    label: "Auction",
    href: "/auction",
    svgPath: LookSvgUrl,
  },
};

type NavConfig = {
  [K in AppRole | AgencyRole]: Record<
    (typeof NAV_ROUTES_ORDERS)[K][number],
    NavConfigItem<(typeof NAV_ROUTES_ORDERS)[K][number]>
  >;
};

export const NAV_CONFIG: NavConfig = {
  [APP_ROLES.SUPER_ADMIN]: SUPER_ADMIN_NAV_CONFIG,
  [APP_ROLES.ADMIN]: ADMIN_NAV_CONFIG,
  [APP_ROLES.SCOUTER]: SCOUTER_NAV_CONFIG,
  [AGENCY_ROLES.HEAD_BOOKER]: HEAD_BOOKER_NAV_CONFIG,
  [AGENCY_ROLES.BOOKER]: BOOKER_NAV_CONFIG,
};
