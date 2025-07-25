"use server";

import { getSessionToken } from "@/lib/auth/getSessionToken";
import { prismaClient } from "@/lib/db";
import { headers } from "next/headers";
import { APIError } from "better-auth/api";
import { createActionResponse } from "@/lib/utils/createActionResponse";

export const getSessionFromDB = async () => {
  try {
    const headersList = await headers();
    if (!headersList) {
      throw new APIError("UNAUTHORIZED", { message: "Unauthorized" });
    }

    const token = await getSessionToken(headersList);
    if (!token) throw new APIError("UNAUTHORIZED", { message: "Unauthorized" });

    const session = await prismaClient.session.findUnique({ where: { token } });
    if (!session)
      throw new APIError("UNAUTHORIZED", { message: "Unauthorized" });

    return createActionResponse({ data: session });
  } catch (error) {
    return createActionResponse({ error });
  }
};
