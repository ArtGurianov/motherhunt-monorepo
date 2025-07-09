import { ValueOf } from "@shared/ui/lib/types";
import { createAccessControl } from "better-auth/plugins/access";

export const APP_ROLES = {
  SUPER_ADMIN_ROLE: "SUPER_ADMIN_ROLE",
  ADMIN_ROLE: "ADMIN_ROLE",
  SCOUTER_ROLE: "SCOUTER_ROLE",
} as const;
export type AppRole = ValueOf<typeof APP_ROLES>;

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
  [APP_ENTITIES.LOT]: ["create", "update", "ban"],
  [APP_ROLES.SUPER_ADMIN_ROLE]: ["view"],
  [APP_ROLES.ADMIN_ROLE]: ["view"],
  [APP_ROLES.SCOUTER_ROLE]: ["view"],
} as const;

export const appAccessControl = createAccessControl(appActions);

export const APP_ROLES_CONFIG = {
  [APP_ROLES.SUPER_ADMIN_ROLE]: appAccessControl.newRole({
    [APP_ENTITIES.SUPER_ADMIN]: ["update"],
    [APP_ENTITIES.ADMIN]: ["update", "ban"],
    [APP_ENTITIES.SCOUTER]: ["update", "ban"],
    [APP_ENTITIES.LOT]: ["update", "ban"],
    [APP_ROLES.SUPER_ADMIN_ROLE]: ["view"],
    [APP_ROLES.ADMIN_ROLE]: ["view"],
    [APP_ROLES.SCOUTER_ROLE]: ["view"],
  }),
  [APP_ROLES.ADMIN_ROLE]: appAccessControl.newRole({
    [APP_ENTITIES.SCOUTER]: ["update", "ban"],
    [APP_ENTITIES.LOT]: ["update", "ban"],
    [APP_ROLES.ADMIN_ROLE]: ["view"],
    [APP_ROLES.SCOUTER_ROLE]: ["view"],
  }),
  [APP_ROLES.SCOUTER_ROLE]: appAccessControl.newRole({
    [APP_ENTITIES.SCOUTER]: ["update"],
    [APP_ENTITIES.LOT]: ["create", "update"],
    [APP_ROLES.SCOUTER_ROLE]: ["view"],
  }),
};
