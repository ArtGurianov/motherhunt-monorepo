"use server";

import { prismaClient } from "@/lib/db";
export const getMemberRole = async ({
  userId,
  organizationId,
}: {
  userId: string;
  organizationId: string;
}): Promise<{ role: string; memberId: string } | null> => {
  const member = await prismaClient.member.findFirst({
    where: { userId, organizationId },
  });

  return member ? { role: member.role, memberId: member.id } : null;
};
