"use server";

import { prismaClient } from "@/lib/db";
import { createActionResponse } from "@/lib/utils/createActionResponse";

export const getMemberRole = async ({
  userId,
  organizationId,
}: {
  userId: string;
  organizationId: string;
}) => {
  try {
    const member = await prismaClient.member.findFirst({
      where: { userId, organizationId },
    });

    return createActionResponse({
      data: member ? { role: member.role, memberId: member.id } : null,
    });
  } catch (error) {
    return createActionResponse({ error });
  }
};
