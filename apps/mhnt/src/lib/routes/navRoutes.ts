import {
  AdminSvgUrl,
  AgencySvgUrl,
  CaseSvgUrl,
  DealSvgUrl,
  HuntSvgUrl,
  LookSvgUrl,
} from "@/components/Svg";
import { APP_ROLES, AppRole } from "@/lib/auth/permissions/app-permissions";
import {
  AGENCY_ROLES,
  AgencyRole,
} from "@/lib/auth/permissions/agency-permissions";
import { APP_ROUTES, AppRoute } from "./routes";

export const SUPER_ADMIN_NAV_ROUTES_ORDER = [
  APP_ROUTES.AUCTION,
  APP_ROUTES.ADMINS,
  APP_ROUTES.CASES,
] as const;
export const ADMIN_NAV_ROUTES_ORDER = [APP_ROUTES.CASES] as const;
export const SCOUTER_NAV_ROUTES_ORDER = [
  APP_ROUTES.AUCTION,
  APP_ROUTES.HUNT,
  APP_ROUTES.DEALS,
] as const;
export const HEAD_BOOKER_NAV_ROUTES_ORDER = [
  APP_ROUTES.AUCTION,
  APP_ROUTES.AGENCY,
  APP_ROUTES.DEALS,
] as const;
export const BOOKER_NAV_ROUTES_ORDER = [APP_ROUTES.AUCTION] as const;

export const NAV_ROUTES_ORDERS = {
  [APP_ROLES.SUPER_ADMIN_ROLE]: SUPER_ADMIN_NAV_ROUTES_ORDER,
  [APP_ROLES.ADMIN_ROLE]: ADMIN_NAV_ROUTES_ORDER,
  [APP_ROLES.SCOUTER_ROLE]: SCOUTER_NAV_ROUTES_ORDER,
  [AGENCY_ROLES.HEAD_BOOKER_ROLE]: HEAD_BOOKER_NAV_ROUTES_ORDER,
  [AGENCY_ROLES.BOOKER_ROLE]: BOOKER_NAV_ROUTES_ORDER,
} satisfies Record<AppRole | AgencyRole, readonly AppRoute[]>;

export const NAV_ROUTES_SVG_PATHS = {
  [APP_ROUTES.AUCTION]: LookSvgUrl,
  [APP_ROUTES.CASES]: CaseSvgUrl,
  [APP_ROUTES.DEALS]: DealSvgUrl,
  [APP_ROUTES.HUNT]: HuntSvgUrl,
  [APP_ROUTES.AGENCY]: AgencySvgUrl,
  [APP_ROUTES.ADMINS]: AdminSvgUrl,
} as const;
