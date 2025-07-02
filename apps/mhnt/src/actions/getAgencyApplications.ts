"use server";

import { prismaClient } from "@/lib/db";
import { createActionResponse } from "@shared/ui/lib/utils";

export const getAgencyApplications = async ({
  applicantId,
  reviewerId,
  type = "all",
}: {
  reviewerId?: string;
  applicantId?: string;
  type?: "all" | "pending";
}) => {
  try {
    const data = await prismaClient.agencyApplication.findMany({
      where: {
        ...(type === "pending"
          ? {
              reviewerId: null,
            }
          : {}),
        ...(reviewerId
          ? {
              reviewerId,
            }
          : {}),
        ...(applicantId
          ? {
              applicantId,
            }
          : {}),
      },
    });
    return createActionResponse({ data });
  } catch (error) {
    return createActionResponse({ error });
  }
};
