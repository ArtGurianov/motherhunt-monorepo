import { Organization } from "@shared/db";
import {
  OrganizationAfterReviewMetadata,
  OrganizationBeforeReviewMetadata,
} from "./types";
import { ValueOf } from "@shared/ui/lib/types";

export const APPLICATION_STATUSES = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;
export type ApplicationStatus = ValueOf<typeof APPLICATION_STATUSES>;

export const getAgencyApplicationStatus = (agencyData: Organization) => {
  const metadata = JSON.parse(
    agencyData.metadata!
  ) as unknown as OrganizationBeforeReviewMetadata &
    OrganizationAfterReviewMetadata;
  console.log(metadata);
  if (metadata.rejectionReason) {
    return APPLICATION_STATUSES.REJECTED;
  }
  if (metadata.reviewerId) {
    return APPLICATION_STATUSES.APPROVED;
  }
  return APPLICATION_STATUSES.PENDING;
};
