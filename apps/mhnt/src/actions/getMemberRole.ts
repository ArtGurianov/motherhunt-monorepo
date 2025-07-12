"use server";

import { prismaClient } from "@/lib/db";
import { APIError } from "@/lib/auth/apiError";

export const getMemberRole = async ({
  userId,
  email,
  organizationId,
}: {
  userId: string;
  organizationId: string;
  email?: string;
}) => {
  const membership = await prismaClient.member.findFirst({
    where: { userId, organizationId },
  });

  if (membership) return membership.role;

  if (!email)
    throw new APIError("FORBIDDEN", {
      message: "Membership not found",
    });

  const invitation = await prismaClient.invitation.findFirst({
    where: { email, organizationId },
  });

  if (!invitation || invitation.status !== "pending") {
    throw new APIError("FORBIDDEN", {
      message: "Membership not found",
    });
  }

  return invitation.role;
};
