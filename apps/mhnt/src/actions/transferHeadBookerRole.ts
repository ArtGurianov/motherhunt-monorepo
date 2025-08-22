"use server";

import { APIError } from "better-auth/api";
import {
  ORG_ENTITIES,
  ORG_ROLES,
} from "@/lib/auth/permissions/org-permissions";
import { prismaClient } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createActionResponse } from "@/lib/utils/createActionResponse";
import { canAccessCustomRole } from "@/lib/auth/permissions/checkers";
import { CUSTOM_MEMBER_ROLES, CustomMemberRole } from "@/lib/auth/customRoles";

const ALLOWED_CUSTOM_ROLES: CustomMemberRole[] = [
  CUSTOM_MEMBER_ROLES.HEADBOOKER_ROLE,
] as const;

export const transferHeadBookerRole = async (targetId: string) => {
  try {
    const result = await canAccessCustomRole(
      ORG_ENTITIES.OWNER,
      "transferRole",
      ALLOWED_CUSTOM_ROLES
    );
    if (!result.canAccess)
      throw new APIError("FORBIDDEN", { message: "Access Denied" });

    const { memberId } = result;

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
