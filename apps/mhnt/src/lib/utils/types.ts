export interface OrganizationBeforeReviewMetadata {
  creatorId: string;
  creatorEmail: string;
}

export interface OrganizationAfterReviewMetadata {
  rejectionReason?: string;
  reviewerAddress: string;
}
