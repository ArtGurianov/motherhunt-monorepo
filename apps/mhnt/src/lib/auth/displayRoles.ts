import { ValueOf } from "@shared/ui/lib/types";
import { ORG_ROLES, OrgRole } from "./permissions/org-permissions";
import { ORG_TYPES, OrgType } from "../utils/types";
import { AppClientError } from "@shared/ui/lib/utils/appClientError";

export const DISPLAY_USER_ROLES = {
  SCOUTER_ROLE: "SCOUTER_ROLE",
  MODEL_ROLE: "MODEL_ROLE",
  HEADBOOKER_ROLE: "HEADBOOKER_ROLE",
  BOOKER_ROLE: "BOOKER_ROLE",
} as const;

export type DisplayUserRole = ValueOf<typeof DISPLAY_USER_ROLES>;

export const getDisplayUserRole = (
  orgType: OrgType,
  orgRole: OrgRole
): DisplayUserRole => {
  switch (orgType) {
    case ORG_TYPES.AGENCY:
      switch (orgRole) {
        case ORG_ROLES.OWNER_ROLE:
          return DISPLAY_USER_ROLES.HEADBOOKER_ROLE;
        case ORG_ROLES.MEMBER_ROLE:
          return DISPLAY_USER_ROLES.BOOKER_ROLE;
        default:
          throw new AppClientError("Unknown AGENCY role");
      }
    case ORG_TYPES.SCOUTING:
      switch (orgRole) {
        case ORG_ROLES.OWNER_ROLE:
          return DISPLAY_USER_ROLES.SCOUTER_ROLE;
        case ORG_ROLES.MEMBER_ROLE:
          return DISPLAY_USER_ROLES.MODEL_ROLE;
        default:
          throw new AppClientError("Unknown SCOUTING role");
      }
    default:
      throw new AppClientError("Unknown ORG type");
  }
};
