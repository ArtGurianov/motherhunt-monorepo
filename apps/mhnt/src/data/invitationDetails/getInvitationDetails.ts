import "server-only";

import { unstable_cacheTag as cacheTag } from "next/cache";
import { prismaClient } from "@/lib/db";
import { cache } from "react";

export const getInvitationDetails = cache(async (invitationId: string) => {
  "use cache";
  cacheTag(`invitation-details:${invitationId}`);

  const invitationDetails = await prismaClient.invitation.findUnique({
    where: { id: invitationId },
  });

  return invitationDetails;
});
