"use server";

import { getSessionToken } from "@/lib/auth/getSessionToken";
import { prismaClient } from "@/lib/db";
import { createActionResponse } from "@shared/ui/lib/utils";
import { AppClientError } from "@shared/ui/lib/utils/appClientError";
import { headers } from "next/headers";

export const getSessionFromDB = async () => {
  try {
    const headersList = await headers();
    if (!headersList) {
      throw new AppClientError("Unauthorized");
    }

    const token = await getSessionToken(headersList);
    if (!token) throw new AppClientError("Unauthorized");

    const session = await prismaClient.session.findUnique({ where: { token } });
    if (!session) throw new AppClientError("Unauthorized");

    return createActionResponse({ data: session });
  } catch (error) {
    return createActionResponse({ error });
  }
};
