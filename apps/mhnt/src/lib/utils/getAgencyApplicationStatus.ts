import { Organization } from "@shared/db";
import { OrganizationAfterReviewMetadata } from "./types";
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
  ) as unknown as OrganizationAfterReviewMetadata;
  if (metadata.rejectionReason) {
    return {
      status: APPLICATION_STATUSES.REJECTED,
      rejectionReason: metadata.rejectionReason,
    };
  }
  if (metadata.reviewerAddress) {
    return { status: APPLICATION_STATUSES.APPROVED };
  }
  return { status: APPLICATION_STATUSES.PENDING };
};
