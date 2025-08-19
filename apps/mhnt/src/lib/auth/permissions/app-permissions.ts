import { ValueOf } from "@shared/ui/lib/types";
import { createAccessControl } from "better-auth/plugins/access";

export const APP_ROLES = {
  MYDAOGS_ADMIN_ROLE: "MYDAOGS_ADMIN_ROLE",
  PROJECT_SUPERADMIN_ROLE: "PROJECT_SUPERADMIN_ROLE",
  PROJECT_ADMIN_ROLE: "PROJECT_ADMIN_ROLE",
  USER_ROLE: "USER_ROLE",
} as const;
export type AppRole = ValueOf<typeof APP_ROLES>;

export const APP_ENTITIES = {
  SUPERADMIN: "SUPERADMIN",
  ADMIN: "ADMIN",
  SCOUTER: "SCOUTER",
  MODEL: "MODEL",
  ORGANIZATION: "ORGANIZATION",
  LOT: "LOT",
} as const;
export type AppEntity = ValueOf<typeof APP_ENTITIES>;

const appActions = {
  [APP_ENTITIES.SUPERADMIN]: ["update"],
  [APP_ENTITIES.ADMIN]: ["update"],
  [APP_ENTITIES.SCOUTER]: ["update", "ban"],
  [APP_ENTITIES.MODEL]: ["update", "ban"],
  [APP_ENTITIES.ORGANIZATION]: ["process"],
  [APP_ENTITIES.LOT]: ["create", "update", "ban"],
  [APP_ROLES.MYDAOGS_ADMIN_ROLE]: ["view"],
  [APP_ROLES.PROJECT_SUPERADMIN_ROLE]: ["view"],
  [APP_ROLES.PROJECT_ADMIN_ROLE]: ["view"],
  [APP_ROLES.USER_ROLE]: ["view", "update"],
} as const;

export const appAccessControl = createAccessControl(appActions);

export const APP_ROLES_CONFIG = {
  [APP_ROLES.MYDAOGS_ADMIN_ROLE]: appAccessControl.newRole({
    [APP_ROLES.MYDAOGS_ADMIN_ROLE]: ["view"],
    [APP_ROLES.PROJECT_SUPERADMIN_ROLE]: ["view"],
    [APP_ROLES.PROJECT_ADMIN_ROLE]: ["view"],
    [APP_ROLES.USER_ROLE]: ["view"],
    [APP_ENTITIES.SUPERADMIN]: ["update"],
  }),
  [APP_ROLES.PROJECT_SUPERADMIN_ROLE]: appAccessControl.newRole({
    [APP_ROLES.PROJECT_SUPERADMIN_ROLE]: ["view"],
    [APP_ROLES.PROJECT_ADMIN_ROLE]: ["view"],
    [APP_ROLES.USER_ROLE]: ["view"],
    [APP_ENTITIES.ADMIN]: ["update"],
    [APP_ENTITIES.SCOUTER]: ["update", "ban"],
    [APP_ENTITIES.MODEL]: ["update", "ban"],
    [APP_ENTITIES.ORGANIZATION]: ["process"],
    [APP_ENTITIES.LOT]: ["update", "ban"],
  }),
  [APP_ROLES.PROJECT_ADMIN_ROLE]: appAccessControl.newRole({
    [APP_ROLES.PROJECT_ADMIN_ROLE]: ["view"],
    [APP_ROLES.USER_ROLE]: ["view"],
    [APP_ENTITIES.SCOUTER]: ["update", "ban"],
    [APP_ENTITIES.MODEL]: ["update", "ban"],
    [APP_ENTITIES.ORGANIZATION]: ["process"],
    [APP_ENTITIES.LOT]: ["update", "ban"],
  }),
  [APP_ROLES.USER_ROLE]: appAccessControl.newRole({
    [APP_ROLES.USER_ROLE]: ["view", "update"],
  }),
};
