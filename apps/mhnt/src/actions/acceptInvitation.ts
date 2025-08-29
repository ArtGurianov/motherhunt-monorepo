"use server";

import auth from "@/lib/auth/auth";
import { prismaClient } from "@/lib/db";
import { APP_ROUTES, APP_ROUTES_CONFIG } from "@/lib/routes/routes";
import { buildDynamicRoutePath } from "@/lib/utils/buildDynamicRoutePath";
import { createActionResponse } from "@/lib/utils/createActionResponse";
import { APIError } from "better-auth/api";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const acceptInvitation = async (invitationId: string) => {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });
    if (!session) {
      throw new APIError("UNAUTHORIZED", { message: "Unauthorized" });
    }

    const { email: inviteeEmail } = session.user;

    const invitationDetails = await prismaClient.invitation.findUnique({
      where: { id: invitationId },
    });

    if (!invitationDetails)
      throw new APIError("NOT_FOUND", { message: "Invitation not found" });

    if (invitationDetails.status !== "pending") {
      throw new APIError("BAD_REQUEST", {
        message: "Invitation closed",
      });
    }

    if (inviteeEmail !== invitationDetails.email)
      throw new APIError("FORBIDDEN", {
        message: "Not an invitee email",
      });

    await auth.api.acceptInvitation({
      body: {
        invitationId,
      },
    });

    revalidatePath(
      buildDynamicRoutePath(
        APP_ROUTES_CONFIG[APP_ROUTES.AGENCY_ACCEPT_INVITATION].href,
        {
          invitationId,
        }
      )
    );

    return createActionResponse();
  } catch (error) {
    return createActionResponse({ error });
  }
};
