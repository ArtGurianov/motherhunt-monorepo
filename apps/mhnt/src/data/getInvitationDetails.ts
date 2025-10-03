import "server-only";

import { prismaClient } from "@/lib/db";
import { createActionResponse } from "@/lib/utils/createActionResponse";

export const getInvitationDetails = async (invitationId: string) => {
  try {
    const invitationDetails = await prismaClient.invitation.findUnique({
      where: { id: invitationId },
    });

    return createActionResponse({ data: invitationDetails });
  } catch (error) {
    return createActionResponse({ error });
  }
};
