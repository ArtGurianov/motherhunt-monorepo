import { ValueOf } from "@shared/ui/lib/types";
import { createAccessControl } from "better-auth/plugins/access";

export const AGENCY_ROLES = {
  HEAD_BOOKER_ROLE: "HEAD_BOOKER_ROLE",
  BOOKER_ROLE: "BOOKER_ROLE",
} as const;
export type AgencyRole = ValueOf<typeof AGENCY_ROLES>;

export const AGENCY_ENTITIES = {
  HEAD_BOOKER: "HEAD_BOOKER",
  BOOKER: "BOOKER",
  ORGANIZATION: "ORGANIZATION",
  BID: "BID",
  SELECTION: "SELECTION",
} as const;
export type AgencyEntity = ValueOf<typeof AGENCY_ENTITIES>;

const agencyActions = {
  [AGENCY_ENTITIES.ORGANIZATION]: ["update"],
  [AGENCY_ENTITIES.HEAD_BOOKER]: ["update"],
  [AGENCY_ENTITIES.BOOKER]: ["update", "ban"],
  [AGENCY_ENTITIES.BID]: ["create", "update"],
  [AGENCY_ENTITIES.SELECTION]: ["create", "update"],
  [AGENCY_ROLES.HEAD_BOOKER_ROLE]: ["view"],
  [AGENCY_ROLES.BOOKER_ROLE]: ["view"],
} as const;

export const agencyAccessControl = createAccessControl(agencyActions);

export const AGENCY_ROLES_CONFIG = {
  [AGENCY_ROLES.HEAD_BOOKER_ROLE]: agencyAccessControl.newRole({
    [AGENCY_ENTITIES.ORGANIZATION]: ["update"],
    [AGENCY_ENTITIES.HEAD_BOOKER]: ["update"],
    [AGENCY_ENTITIES.BOOKER]: ["update", "ban"],
    [AGENCY_ENTITIES.BID]: ["create", "update"],
    [AGENCY_ENTITIES.SELECTION]: ["create", "update"],
    [AGENCY_ROLES.HEAD_BOOKER_ROLE]: ["view"],
    [AGENCY_ROLES.BOOKER_ROLE]: ["view"],
  }),
  [AGENCY_ROLES.BOOKER_ROLE]: agencyAccessControl.newRole({
    [AGENCY_ENTITIES.SELECTION]: ["create", "update"],
    [AGENCY_ROLES.BOOKER_ROLE]: ["view"],
  }),
};
