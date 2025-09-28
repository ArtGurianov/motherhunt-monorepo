import "server-only";

import { cache } from "react";
import { prismaClient } from "@/lib/db";
import { APIError } from "better-auth/api";
import { createActionResponse } from "@/lib/utils/createActionResponse";
import { unstable_cacheTag as cacheTag } from "next/cache";

export const getSessionByToken = cache(async (token: string) => {
  "use cache";
  
  cacheTag(`session:${token}`);
  try {
    const data = await prismaClient.session.findUnique({
      where: { token },
      include: { user: true },
    });
    if (!data) throw new APIError("UNAUTHORIZED", { message: "Unauthorized" });

    const { user, ...rest } = data;

    return createActionResponse({ data: { user, session: rest } });
  } catch (error) {
    return createActionResponse({ error });
  }
});
