import { ValueOf } from "@shared/ui/lib/types";

export type ExtractPathParams<Path extends string> =
  /* eslint-disable @typescript-eslint/no-unused-vars */
  Path extends `${infer _Start}[${infer Param}]${infer Rest}`
    ? Param | ExtractPathParams<Rest>
    : never;

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
