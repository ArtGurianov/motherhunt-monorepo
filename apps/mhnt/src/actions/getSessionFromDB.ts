"use server";

import { getSessionToken } from "@/lib/auth/getSessionToken";
import { prismaClient } from "@/lib/db";
import { headers } from "next/headers";
import { APIError } from "@/lib/auth/apiError";

export const getSessionFromDB = async () => {
  const headersList = await headers();
  if (!headersList) {
    throw new APIError("UNAUTHORIZED", { message: "Unauthorized" });
  }

  const token = await getSessionToken(headersList);
  if (!token) throw new APIError("UNAUTHORIZED", { message: "Unauthorized" });

  const session = await prismaClient.session.findUnique({ where: { token } });
  if (!session) throw new APIError("UNAUTHORIZED", { message: "Unauthorized" });

  return session;
};
