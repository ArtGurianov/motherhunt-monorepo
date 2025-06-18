"use server";

import { auth } from "@/lib/auth";
import { prismaClient } from "@/lib/db";
import { createActionResponse } from "@shared/ui/lib/utils";
import { AppClientError } from "@shared/ui/lib/utils/appClientError";
import { headers } from "next/headers";

export const createUser = async ({
  userEmail,
  userName,
  userRole,
}: {
  userEmail: string;
  userName: string;
  userRole: "headBooker" | "booker";
}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (
    !session ||
    (userRole === "headBooker" && session.user.role !== "admin") ||
    (userRole === "booker" && session.user.role !== "headBooker")
  ) {
    throw new AppClientError("Forbidden Role");
  }

  try {
    await prismaClient.user.upsert({
      where: { email: userEmail },
      create: {
        email: userEmail,
        name: userName,
        role: userRole,
        emailVerified: true,
      },
      update: {},
    });
  } catch (e) {
    return createActionResponse({ error: e });
  }
};
