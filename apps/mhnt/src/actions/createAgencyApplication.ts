"use server";

import { auth } from "@/lib/auth/auth";
import { prismaClient } from "@/lib/db";
import { createActionResponse } from "@shared/ui/lib/utils";
import { AppClientError } from "@shared/ui/lib/utils/appClientError";
import { headers } from "next/headers";

export const createAgencyApplication = async (name: string, slug: string) => {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });
    if (!session) {
      throw new AppClientError("Unauthorized");
    }

    const hasPendingRequest = await prismaClient.agencyApplication.findFirst({
      where: { applicantId: session.user.id, reviewerId: null },
    });
    if (hasPendingRequest) {
      throw new AppClientError("Previous application under review");
    }

    await prismaClient.agencyApplication.create({
      data: {
        name,
        slug,
        applicantId: session.user.id,
        applicantEmail: session.user.email,
      },
    });

    return createActionResponse({ data: { success: true } });
  } catch (error) {
    return createActionResponse({ error });
  }
};
