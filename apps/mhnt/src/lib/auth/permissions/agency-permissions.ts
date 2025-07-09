import { ValueOf } from "@shared/ui/lib/types";
import { createAccessControl } from "better-auth/plugins/access";

export const AGENCY_ENTITIES = {
  AGENCY_ORGANIZATION: "AGENCY_ORGANIZATION",
  AGENCY_HEAD_BOOKER: "AGENCY_HEAD_BOOKER",
  AGENCY_BOOKER: "AGENCY_BOOKER",
  BID: "BID",
} as const;
export type AgencyEntity = ValueOf<typeof AGENCY_ENTITIES>;

const agencyActions = {
  [AGENCY_ENTITIES.AGENCY_ORGANIZATION]: ["view", "update"],
  [AGENCY_ENTITIES.AGENCY_HEAD_BOOKER]: ["update"],
  [AGENCY_ENTITIES.AGENCY_BOOKER]: ["update", "ban"],
  [AGENCY_ENTITIES.BID]: ["create", "update"],
} as const;

export const agencyAccessControl = createAccessControl(agencyActions);

export const AGENCY_ROLES = {
  HEAD_BOOKER: "HEAD_BOOKER",
  BOOKER: "BOOKER",
} as const;
export type AgencyRole = ValueOf<typeof AGENCY_ROLES>;

export const AGENCY_ROLES_CONFIG = {
  [AGENCY_ROLES.HEAD_BOOKER]: agencyAccessControl.newRole({
    [AGENCY_ENTITIES.AGENCY_ORGANIZATION]: ["view", "update"],
    [AGENCY_ENTITIES.AGENCY_HEAD_BOOKER]: ["update"],
    [AGENCY_ENTITIES.AGENCY_BOOKER]: ["update", "ban"],
    [AGENCY_ENTITIES.BID]: ["create", "update"],
  }),
  [AGENCY_ROLES.BOOKER]: agencyAccessControl.newRole({
    [AGENCY_ENTITIES.AGENCY_ORGANIZATION]: ["view"],
  }),
};
