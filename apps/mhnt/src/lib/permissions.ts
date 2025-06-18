import { ValueOf } from "@shared/ui/lib/types";
import { createAccessControl } from "better-auth/plugins/access";

export const APP_ENTITIES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  USER: "USER", // basic user = scouter
  LOT: "LOT",
  BID: "BID",
} as const;
export type AppEntity = ValueOf<typeof APP_ENTITIES>;

export const AGENCY_ENTITIES = {
  AGENCY_HEAD_BOOKER: "AGENCY_HEAD_BOOKER",
  AGENCY_BOOKER: "AGENCY_BOOKER",
} as const;
export type AgencyEntity = ValueOf<typeof AGENCY_ENTITIES>;

const appActions = {
  // Users
  [APP_ENTITIES.SUPER_ADMIN]: ["update"],
  [APP_ENTITIES.ADMIN]: ["create", "update", "ban"],
  [APP_ENTITIES.USER]: ["update", "ban"],
  [AGENCY_ENTITIES.AGENCY_HEAD_BOOKER]: ["create", "update", "ban"],
  [AGENCY_ENTITIES.AGENCY_BOOKER]: ["create", "update", "ban"],

  [APP_ENTITIES.LOT]: ["create", "update", "ban"],
  [APP_ENTITIES.BID]: ["create", "update"],
} as const;

const agencyActions = {
  [AGENCY_ENTITIES.AGENCY_HEAD_BOOKER]: ["update"],
  [AGENCY_ENTITIES.AGENCY_BOOKER]: ["create", "update", "ban"],
} as const;

export const appAccessControl = createAccessControl(appActions);
export const agencyAccessControl = createAccessControl(agencyActions);

export const appSuperAdminRole = appAccessControl.newRole({
  [APP_ENTITIES.SUPER_ADMIN]: ["update"],
  [APP_ENTITIES.ADMIN]: ["create", "update"],
});

export const appAdminRole = appAccessControl.newRole({
  [APP_ENTITIES.USER]: ["update", "ban"],
  [APP_ENTITIES.LOT]: ["update", "ban"],
  [AGENCY_ENTITIES.AGENCY_HEAD_BOOKER]: ["create", "update", "ban"],
});

export const appUserRole = appAccessControl.newRole({
  [APP_ENTITIES.USER]: ["update"],
});

export const agencyHeadBookerRole = agencyAccessControl.newRole({
  [AGENCY_ENTITIES.AGENCY_HEAD_BOOKER]: ["update"],
  [AGENCY_ENTITIES.AGENCY_BOOKER]: ["create", "update", "ban"],
});

export const agencyBookerRole = agencyAccessControl.newRole({
  [AGENCY_ENTITIES.AGENCY_BOOKER]: ["update"],
});
