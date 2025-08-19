import { ValueOf } from "@shared/ui/lib/types";

export const ORG_TYPES = {
  SCOUTING: "SCOUTING",
  AGENCY: "AGENCY",
} as const;

export type OrgType = ValueOf<typeof ORG_TYPES>;
export interface OrgMetadata {
  orgType: OrgType;
  creatorUserId: string;
  reviewerAddress?: string;
  rejectionReason?: string;
}
