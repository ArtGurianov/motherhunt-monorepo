"use server";

import auth from "@/lib/auth/auth";
import { prismaClient } from "@/lib/db";
import { createActionResponse } from "@/lib/utils/createActionResponse";
import { APIError } from "better-auth/api";
import { headers } from "next/headers";

export const getMyDrafts = async () => {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session)
      throw new APIError("UNAUTHORIZED", { message: "Unauthorized" });

    const myDrafts = await prismaClient.lot.findMany({
      where: { scouterId: session.session.userId },
    });

    return createActionResponse({ data: myDrafts });
  } catch (error) {
    return createActionResponse({ error });
  }
};
