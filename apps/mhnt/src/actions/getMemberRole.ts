"use server";

import { prismaClient } from "@/lib/db";
import { APIError } from "@/lib/auth/apiError";
import { AgencyRole } from "@/lib/auth/permissions/agency-permissions";

export const getMemberRole = async ({
  userId,
  email,
  organizationId,
}: {
  userId: string;
  organizationId: string;
  email?: string;
}): Promise<{ role: string | null; memberId: string | null }> => {
  const membership = await prismaClient.member.findFirst({
    where: { userId, organizationId },
  });

  if (membership)
    return { role: membership.role as AgencyRole, memberId: membership.id };

  if (!email)
    throw new APIError("FORBIDDEN", {
      message: "Membership not found",
    });

  const invitation = await prismaClient.invitation.findFirst({
    where: { email, organizationId },
  });

  if (invitation?.status === "pending") {
    return { role: invitation.role as AgencyRole, memberId: null };
  }

  return { role: null, memberId: null };
};
