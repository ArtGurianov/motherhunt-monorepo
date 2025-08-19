import {
  AdminSvgUrl,
  AgencySvgUrl,
  CaseSvgUrl,
  DealSvgUrl,
  HuntSvgUrl,
  LookSvgUrl,
} from "@/components/Svg";
import { APP_ROLES, AppRole } from "@/lib/auth/permissions/app-permissions";
import { APP_ROUTES, AppRoute } from "./routes";
import { DISPLAY_USER_ROLES, DisplayUserRole } from "../auth/displayRoles";

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
export const HEADBOOKER_NAV_ROUTES_ORDER = [
  APP_ROUTES.AUCTION,
  APP_ROUTES.AGENCY_MANAGE,
  APP_ROUTES.DEALS,
] as const;
export const BOOKER_NAV_ROUTES_ORDER = [APP_ROUTES.AUCTION] as const;

export const NAV_ROUTES_ORDERS = {
  [APP_ROLES.MYDAOGS_ADMIN_ROLE]: [],
  [APP_ROLES.PROJECT_SUPERADMIN_ROLE]: SUPER_ADMIN_NAV_ROUTES_ORDER,
  [APP_ROLES.PROJECT_ADMIN_ROLE]: ADMIN_NAV_ROUTES_ORDER,
  [APP_ROLES.USER_ROLE]: [],
  [DISPLAY_USER_ROLES.SCOUTER_ROLE]: SCOUTER_NAV_ROUTES_ORDER,
  [DISPLAY_USER_ROLES.MODEL_ROLE]: [],
  [DISPLAY_USER_ROLES.HEADBOOKER_ROLE]: HEADBOOKER_NAV_ROUTES_ORDER,
  [DISPLAY_USER_ROLES.BOOKER_ROLE]: BOOKER_NAV_ROUTES_ORDER,
} satisfies Record<AppRole | DisplayUserRole, readonly AppRoute[]>;

export const NAV_ROUTES_SVG_PATHS = {
  [APP_ROUTES.AUCTION]: LookSvgUrl,
  [APP_ROUTES.CASES]: CaseSvgUrl,
  [APP_ROUTES.DEALS]: DealSvgUrl,
  [APP_ROUTES.HUNT]: HuntSvgUrl,
  [APP_ROUTES.AGENCY_MANAGE]: AgencySvgUrl,
  [APP_ROUTES.ADMINS]: AdminSvgUrl,
} as const;
