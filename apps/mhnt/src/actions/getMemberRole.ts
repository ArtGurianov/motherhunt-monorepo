"use server";

import { prismaClient } from "@/lib/db";
import { Member } from "@shared/db";

export const getMemberRole = async (userId: string, organizationId: string) => {
  let membership: Member | null = null;
  try {
    membership = await prismaClient.member.findFirst({
      where: { userId, organizationId },
    });
  } catch {}

  return membership?.role ?? null;
};
