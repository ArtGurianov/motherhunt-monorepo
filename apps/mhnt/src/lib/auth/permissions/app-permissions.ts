import { ValueOf } from "@shared/ui/lib/types";
import { AGENCY_ENTITIES } from "./agency-permissions";
import { createAccessControl } from "better-auth/plugins/access";

export const APP_ENTITIES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  SCOUTER: "SCOUTER",
  LOT: "LOT",
} as const;
export type AppEntity = ValueOf<typeof APP_ENTITIES>;

const appActions = {
  [APP_ENTITIES.SUPER_ADMIN]: ["update"],
  [APP_ENTITIES.ADMIN]: ["create", "update", "ban"],
  [APP_ENTITIES.SCOUTER]: ["update", "ban"],
  [AGENCY_ENTITIES.AGENCY_ORGANIZATION]: ["create", "update", "ban"],
  [AGENCY_ENTITIES.AGENCY_HEAD_BOOKER]: ["create", "update", "ban"],
  [APP_ENTITIES.LOT]: ["create", "update", "ban"],
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
    [APP_ENTITIES.ADMIN]: ["update", "ban"],
    [APP_ENTITIES.SCOUTER]: ["update", "ban"],
    [APP_ENTITIES.LOT]: ["update", "ban"],
  }),
  [APP_ROLES.ADMIN]: appAccessControl.newRole({
    [APP_ENTITIES.SCOUTER]: ["update", "ban"],
    [APP_ENTITIES.LOT]: ["update", "ban"],
  }),
  [APP_ROLES.SCOUTER]: appAccessControl.newRole({
    [APP_ENTITIES.SCOUTER]: ["update"],
    [APP_ENTITIES.LOT]: ["create", "update"],
  }),
};
