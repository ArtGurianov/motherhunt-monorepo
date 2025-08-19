"use server";

import { APIError } from "better-auth/api";
import { ORG_ROLES } from "@/lib/auth/permissions/org-permissions";
import { canTransferAgencyOwnerRole } from "@/lib/auth/permissions/checkers";
import { prismaClient } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createActionResponse } from "@/lib/utils/createActionResponse";

export const transferHeadBookerRole = async (targetId: string) => {
  try {
    const { memberId, canAccess } = await canTransferAgencyOwnerRole();
    if (!canAccess)
      throw new APIError("FORBIDDEN", { message: "Access Denied" });

    await prismaClient.$transaction([
      prismaClient.member.update({
        where: { id: memberId },
        data: { role: ORG_ROLES.MEMBER_ROLE },
      }),
      prismaClient.member.update({
        where: { id: targetId },
        data: { role: ORG_ROLES.OWNER_ROLE },
      }),
    ]);

    revalidatePath("/agency");

    return createActionResponse();
  } catch (error) {
    return createActionResponse({ error });
  }
};
