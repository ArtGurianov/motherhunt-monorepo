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
} as const;
export type AppEntity = ValueOf<typeof APP_ENTITIES>;

export const APP_ACTIONS = {
  [APP_ENTITIES.SUPERADMIN]: ["create", "update", "revoke"],
  [APP_ENTITIES.ADMIN]: ["update"],
  [APP_ENTITIES.SCOUTER]: ["update", "ban"],
  [APP_ENTITIES.MODEL]: ["update", "ban"],
  [APP_ENTITIES.ORGANIZATION]: ["create", "process"],
} as const;
export type AppAction<TKey extends AppEntity> =
  (typeof APP_ACTIONS)[TKey][number];

export const appAccessControl = createAccessControl(APP_ACTIONS);

export const APP_ROLES_CONFIG = {
  [APP_ROLES.MYDAOGS_ADMIN_ROLE]: appAccessControl.newRole({
    [APP_ENTITIES.SUPERADMIN]: ["create", "update", "revoke"],
  }),
  [APP_ROLES.PROJECT_SUPERADMIN_ROLE]: appAccessControl.newRole({
    [APP_ENTITIES.ADMIN]: ["update"],
    [APP_ENTITIES.SCOUTER]: ["update", "ban"],
    [APP_ENTITIES.MODEL]: ["update", "ban"],
    [APP_ENTITIES.ORGANIZATION]: ["process"],
  }),
  [APP_ROLES.PROJECT_ADMIN_ROLE]: appAccessControl.newRole({
    [APP_ENTITIES.SCOUTER]: ["update", "ban"],
    [APP_ENTITIES.MODEL]: ["update", "ban"],
    [APP_ENTITIES.ORGANIZATION]: ["process"],
  }),
  [APP_ROLES.USER_ROLE]: appAccessControl.newRole({
    [APP_ENTITIES.ORGANIZATION]: ["create"],
  }),
};
