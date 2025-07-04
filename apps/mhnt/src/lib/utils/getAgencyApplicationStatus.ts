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

export const getAgencyApplicationStatus = (
  agencyData: Organization
): { status: ApplicationStatus; rejectionReason?: string } => {
  const metadata = JSON.parse(
    agencyData.metadata!
  ) as unknown as OrganizationBeforeReviewMetadata &
    OrganizationAfterReviewMetadata;
  if (metadata.rejectionReason) {
    return {
      status: APPLICATION_STATUSES.REJECTED,
      rejectionReason: metadata.rejectionReason,
    };
  }
  if (metadata.reviewerId) {
    return { status: APPLICATION_STATUSES.APPROVED };
  }
  return { status: APPLICATION_STATUSES.PENDING };
};
