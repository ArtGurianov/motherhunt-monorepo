"use server";

import { APIError } from "@/lib/auth/apiError";
import { AGENCY_ROLES } from "@/lib/auth/permissions/agency-permissions";
import { canTransferHeadBookerRole } from "@/lib/auth/permissions/checkers";
import { prismaClient } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const transferHeadBookerRole = async (targetId: string) => {
  const { memberId, canAccess } = await canTransferHeadBookerRole();
  if (!canAccess) throw new APIError("FORBIDDEN", { message: "Access Denied" });

  await prismaClient.$transaction([
    prismaClient.member.update({
      where: { id: memberId },
      data: { role: AGENCY_ROLES.BOOKER_ROLE },
    }),
    prismaClient.member.update({
      where: { id: targetId },
      data: { role: AGENCY_ROLES.HEAD_BOOKER_ROLE },
    }),
  ]);

  revalidatePath("/agency");
};
