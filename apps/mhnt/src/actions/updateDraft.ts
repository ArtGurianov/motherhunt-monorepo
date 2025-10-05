"use server";

import { CUSTOM_MEMBER_ROLES, CustomMemberRole } from "@/lib/auth/customRoles";
import { canAccessCustomRole } from "@/lib/auth/permissions/checkers";
import { ORG_ENTITIES } from "@/lib/auth/permissions/org-permissions";
import { prismaClient } from "@/lib/db";
import { createActionResponse } from "@/lib/utils/createActionResponse";
import { Lot } from "@shared/db";
import { AppBusinessError } from "@/lib/utils/errorUtils";
import { APIError } from "better-auth/api";
import { revalidatePath } from "next/cache";

const ALLOWED_CUSTOM_ROLES: CustomMemberRole[] = [
  CUSTOM_MEMBER_ROLES.SCOUTER_ROLE,
] as const;

interface UpdateDraftProps {
  lotId: string;
  updateData: Partial<Lot>;
}

export const updateDraft = async ({ lotId, updateData }: UpdateDraftProps) => {
  try {
    const result = await canAccessCustomRole(
      ORG_ENTITIES.LOT,
      "update",
      ALLOWED_CUSTOM_ROLES
    );
    if (!result.canAccess)
      throw new APIError("FORBIDDEN", { message: "Access Denied" });

    const { userId } = result;

    const lotData = await prismaClient.lot.findUnique({ where: { id: lotId } });

    if (lotData?.scouterId !== userId)
      throw new APIError("FORBIDDEN", {
        message: "Not a lot creator",
      });

    if (lotData.isConfirmationEmailSent)
      throw new AppBusinessError(
        "Need to cancel previous confirmation email first",
        400
      );

    await prismaClient.lot.update({
      where: { id: lotId },
      data: updateData,
    });

    revalidatePath(`/hunt/drafts/${lotId}`);

    return createActionResponse();
  } catch (error) {
    return createActionResponse({ error });
  }
};
