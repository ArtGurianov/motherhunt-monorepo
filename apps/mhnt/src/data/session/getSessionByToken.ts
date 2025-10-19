import "server-only";

import { cache } from "react";
import { prismaClient } from "@/lib/db";
import { APIError } from "better-auth/api";
// import { unstable_cacheTag as cacheTag } from "next/cache";
import { AppSession } from "./types";

export const getSessionByToken = cache(
  async (token: string): Promise<AppSession> => {
    // "use cache";
    // cacheTag(`session:${token}`);

    const data = await prismaClient.session.findUnique({
      where: { token },
      include: { user: true },
    });
    if (!data) throw new APIError("UNAUTHORIZED", { message: "Unauthorized" });

    const { user, ...rest } = data;

    return { user, session: rest };
  }
);
