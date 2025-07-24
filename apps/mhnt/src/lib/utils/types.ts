export interface OrganizationBeforeReviewMetadata {
  applicantEmail: string;
}

export interface OrganizationAfterReviewMetadata {
  reviewerAddress: string;
  rejectionReason?: string;
}
