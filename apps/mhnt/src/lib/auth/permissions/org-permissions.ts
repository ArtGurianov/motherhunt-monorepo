import { ValueOf } from "@shared/ui/lib/types";
import { createAccessControl } from "better-auth/plugins/access";

export const ORG_ROLES = {
  OWNER_ROLE: "OWNER_ROLE",
  MEMBER_ROLE: "MEMBER_ROLE",
} as const;
export type OrgRole = ValueOf<typeof ORG_ROLES>;

export const ORG_ENTITIES = {
  OWNER: "OWNER",
  MEMBER: "MEMBER",
  ORGANIZATION: "ORGANIZATION",
  BID: "BID",
  SELECTION: "SELECTION",
} as const;
export type OrgEntity = ValueOf<typeof ORG_ENTITIES>;

export const ORG_ACTIONS = {
  [ORG_ENTITIES.OWNER]: ["view", "update", "transferRole"],
  [ORG_ENTITIES.MEMBER]: ["view", "update", "delete"],
  [ORG_ENTITIES.ORGANIZATION]: ["view", "update"],
  [ORG_ENTITIES.BID]: ["view", "create", "update"],
  [ORG_ENTITIES.SELECTION]: ["view", "create", "update"],
  invitation: ["view", "create", "cancel"],
} as const;
export type OrgAction<TKey extends OrgEntity> =
  (typeof ORG_ACTIONS)[TKey][number];

export const orgAccessControl = createAccessControl(ORG_ACTIONS);

export const ORG_ROLES_CONFIG = {
  [ORG_ROLES.OWNER_ROLE]: orgAccessControl.newRole({
    [ORG_ENTITIES.OWNER]: ["view", "update", "transferRole"],
    [ORG_ENTITIES.MEMBER]: ["view", "update", "delete"],
    [ORG_ENTITIES.ORGANIZATION]: ["view", "update"],
    [ORG_ENTITIES.BID]: ["view", "create", "update"],
    [ORG_ENTITIES.SELECTION]: ["view", "create", "update"],
    invitation: ["view", "create", "cancel"],
  }),
  [ORG_ROLES.MEMBER_ROLE]: orgAccessControl.newRole({
    [ORG_ENTITIES.MEMBER]: ["view", "delete"],
    [ORG_ENTITIES.ORGANIZATION]: ["view"],
    [ORG_ENTITIES.BID]: ["view"],
    [ORG_ENTITIES.SELECTION]: ["view", "create", "update"],
  }),
};
