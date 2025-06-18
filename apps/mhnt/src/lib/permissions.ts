import { ValueOf } from "@shared/ui/lib/types";
import { createAccessControl } from "better-auth/plugins/access";

export const AGENCY_ENTITIES = {
  AGENCY_ORGANIZATION: "AGENCY_ORGANIZATION",
  AGENCY_HEAD_BOOKER: "AGENCY_HEAD_BOOKER",
  AGENCY_BOOKER: "AGENCY_BOOKER",
} as const;
export type AgencyEntity = ValueOf<typeof AGENCY_ENTITIES>;

const agencyActions = {
  [AGENCY_ENTITIES.AGENCY_HEAD_BOOKER]: ["update"],
  [AGENCY_ENTITIES.AGENCY_BOOKER]: ["create", "update", "ban"],
} as const;

export const agencyAccessControl = createAccessControl(agencyActions);

export const AGENCY_ROLES = {
  HEAD_BOOKER: "HEAD_BOOKER",
  BOOKER: "BOOKER",
} as const;
export type AgencyRole = ValueOf<typeof APP_ROLES>;

export const AGENCY_ROLES_CONFIG = {
  [AGENCY_ROLES.HEAD_BOOKER]: agencyAccessControl.newRole({
    [AGENCY_ENTITIES.AGENCY_HEAD_BOOKER]: ["update"],
    [AGENCY_ENTITIES.AGENCY_BOOKER]: ["create", "update", "ban"],
  }),
  [AGENCY_ROLES.BOOKER]: agencyAccessControl.newRole({
    [AGENCY_ENTITIES.AGENCY_BOOKER]: ["update"],
  }),
};

export const APP_ENTITIES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  SCOUTER: "SCOUTER",
  LOT: "LOT",
  BID: "BID",
} as const;
export type AppEntity = ValueOf<typeof APP_ENTITIES>;

const appActions = {
  [APP_ENTITIES.SUPER_ADMIN]: ["update"],
  [APP_ENTITIES.ADMIN]: ["create", "update", "ban"],
  [APP_ENTITIES.SCOUTER]: ["update", "ban"],
  [AGENCY_ENTITIES.AGENCY_ORGANIZATION]: ["create", "update", "ban"],
  [AGENCY_ENTITIES.AGENCY_HEAD_BOOKER]: ["create", "update", "ban"],
  [APP_ENTITIES.LOT]: ["create", "update", "ban"],
  [APP_ENTITIES.BID]: ["create", "update"],
} as const;

export const appAccessControl = createAccessControl(appActions);

export const APP_ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  SCOUTER: "SCOUTER",
} as const;
export type AppRole = ValueOf<typeof APP_ROLES>;

export const APP_ROLES_CONFIG = {
  [APP_ROLES.SUPER_ADMIN]: appAccessControl.newRole({
    [APP_ENTITIES.SUPER_ADMIN]: ["update"],
    [APP_ENTITIES.ADMIN]: ["create", "update", "ban"],
    [APP_ENTITIES.SCOUTER]: ["update", "ban"],
    [APP_ENTITIES.LOT]: ["update", "ban"],
    [AGENCY_ENTITIES.AGENCY_ORGANIZATION]: ["create", "update", "ban"],
    [AGENCY_ENTITIES.AGENCY_HEAD_BOOKER]: ["create", "update", "ban"],
  }),
  [APP_ROLES.ADMIN]: appAccessControl.newRole({
    [APP_ENTITIES.SCOUTER]: ["update", "ban"],
    [APP_ENTITIES.LOT]: ["update", "ban"],
    [AGENCY_ENTITIES.AGENCY_HEAD_BOOKER]: ["create", "update", "ban"],
  }),
  [APP_ROLES.SCOUTER]: appAccessControl.newRole({
    [APP_ENTITIES.SCOUTER]: ["update"],
  }),
};
