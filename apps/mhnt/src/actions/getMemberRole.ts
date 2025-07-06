"use server";

import { prismaClient } from "@/lib/db";
import { APIError } from "@/lib/auth/apiError";

export const getMemberRole = async (userId: string, organizationId: string) => {
  const membership = await prismaClient.member.findFirst({
    where: { userId, organizationId },
  });
  if (!membership) {
    throw new APIError("NOT_FOUND", { message: "Membership not found" });
  }
  return membership.role;
};
