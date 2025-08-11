"use server";

import auth from "@/lib/auth/auth";
import { prismaClient } from "@/lib/db";
import { createActionResponse } from "@/lib/utils/createActionResponse";
import { Lot } from "@shared/db";
import { AppClientError } from "@shared/ui/lib/utils/appClientError";
import { APIError } from "better-auth/api";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

interface UpdateDraftProps {
  lotId: string;
  updateData: Partial<Lot>;
}

export const updateDraft = async ({ lotId, updateData }: UpdateDraftProps) => {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });
    if (!session)
      throw new APIError("UNAUTHORIZED", { message: "Unauthorized" });

    const lotData = await prismaClient.lot.findUnique({ where: { id: lotId } });

    if (lotData?.scouterId !== session.session.userId)
      throw new APIError("FORBIDDEN", {
        message: "Not a lot creator",
      });

    if (lotData.isConfirmationEmailSent)
      throw new AppClientError(
        "Need to cancel previous confirmation email first."
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
