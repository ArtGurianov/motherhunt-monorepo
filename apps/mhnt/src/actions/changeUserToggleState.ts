"use server";

import { getSession } from "@/data/session/getSession";
import { prismaClient } from "@/lib/db";
import { User } from "@shared/db";
import { APIError } from "better-auth/api";
import { createActionResponse } from "@/lib/utils/createActionResponse";

type UserToggleStateField = keyof Pick<
  User,
  "isNewsletterEmailsEnabled" | "isSystemEmailsEnabled"
>;

export const changeUserToggleState = async (
  field: UserToggleStateField,
  value: boolean,
) => {
  try {
    const session = await getSession();
    if (!session) {
      throw new APIError("UNAUTHORIZED", { message: "Unauthorized" });
    }

    await prismaClient.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        [field]: value,
      },
    });

    return createActionResponse({ data: value });
  } catch (error) {
    return createActionResponse({ error });
  }
};
