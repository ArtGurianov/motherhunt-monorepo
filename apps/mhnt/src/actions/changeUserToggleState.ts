"use server";

import auth from "@/lib/auth/auth";
import { prismaClient } from "@/lib/db";
import { User } from "@shared/db";
import { headers } from "next/headers";
import { APIError } from "better-auth/api";
import { createActionResponse } from "@/lib/utils/createActionResponse";

type UserToggleStateField = keyof Pick<
  User,
  "isNewsletterEmailsEnabled" | "isSystemEmailsEnabled"
>;

export const changeUserToggleState = async (
  field: UserToggleStateField,
  value: boolean
) => {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });
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
