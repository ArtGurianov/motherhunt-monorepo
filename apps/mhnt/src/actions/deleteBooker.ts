"use server";

import { APIError } from "better-auth/api";
import { AGENCY_ROLES } from "@/lib/auth/permissions/agency-permissions";
import { canDeleteBooker } from "@/lib/auth/permissions/checkers";
import { prismaClient } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createActionResponse } from "@/lib/utils/createActionResponse";

export const deleteBookerRole = async (targetId: string) => {
  try {
    const { canAccess } = await canDeleteBooker();
    if (!canAccess)
      throw new APIError("FORBIDDEN", { message: "Access Denied" });

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

    return createActionResponse();
  } catch (error) {
    return createActionResponse({ error });
  }
};
