import { ValueOf } from "@shared/ui/lib/types";
import { ORG_ROLES, OrgRole } from "./permissions/org-permissions";
import { ORG_TYPES, OrgType } from "../utils/types";

export const CUSTOM_MEMBER_ROLES = {
  SCOUTER_ROLE: "SCOUTER_ROLE",
  MODEL_ROLE: "MODEL_ROLE",
  HEADBOOKER_ROLE: "HEADBOOKER_ROLE",
  BOOKER_ROLE: "BOOKER_ROLE",
} as const;

export type CustomMemberRole = ValueOf<typeof CUSTOM_MEMBER_ROLES>;

export const getCustomMemberRole = (
  orgType: OrgType,
  orgRole: OrgRole
): CustomMemberRole => {
  switch (orgType) {
    case ORG_TYPES.AGENCY:
      switch (orgRole) {
        case ORG_ROLES.OWNER_ROLE:
          return CUSTOM_MEMBER_ROLES.HEADBOOKER_ROLE;
        case ORG_ROLES.MEMBER_ROLE:
          return CUSTOM_MEMBER_ROLES.BOOKER_ROLE;
        default:
          throw new Error("Unknown AGENCY role");
      }
    case ORG_TYPES.SCOUTING:
      switch (orgRole) {
        case ORG_ROLES.OWNER_ROLE:
          return CUSTOM_MEMBER_ROLES.SCOUTER_ROLE;
        case ORG_ROLES.MEMBER_ROLE:
          return CUSTOM_MEMBER_ROLES.MODEL_ROLE;
        default:
          throw new Error("Unknown SCOUTING role");
      }
    default:
      throw new Error("Unknown ORG type");
  }
};
