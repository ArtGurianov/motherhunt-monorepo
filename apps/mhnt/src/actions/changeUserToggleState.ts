"use server";

import { auth } from "@/lib/auth/auth";
import { prismaClient } from "@/lib/db";
import { User } from "@shared/db";
import { createActionResponse } from "@shared/ui/lib/utils";
import { AppClientError } from "@shared/ui/lib/utils/appClientError";
import { headers } from "next/headers";

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
      throw new AppClientError("Unauthorized");
    }

    await prismaClient.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        [field]: value,
      },
    });

    return createActionResponse({ data: { value } });
  } catch (error) {
    return createActionResponse({ error });
  }
};
