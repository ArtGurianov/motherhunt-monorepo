"use server";

import { APIError } from "@/lib/auth/apiError";
import { AGENCY_ROLES } from "@/lib/auth/permissions/agency-permissions";
import { canDeleteBooker } from "@/lib/auth/permissions/checkers";
import { prismaClient } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const deleteBookerRole = async (targetId: string) => {
  const { canAccess } = await canDeleteBooker();
  if (!canAccess) throw new APIError("FORBIDDEN", { message: "Access Denied" });

  await prismaClient.member.delete({
    where: { id: targetId, role: AGENCY_ROLES.BOOKER_ROLE },
  });

  const bookerSession = await prismaClient.session.findFirst({
    where: { activeMemberId: targetId },
  });

  if (bookerSession) {
    await prismaClient.session.delete({
      where: { id: bookerSession.id },
    });
  }

  revalidatePath("/agency");
};
