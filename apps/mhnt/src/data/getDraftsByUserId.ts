import "server-only";

import { unstable_cacheTag as cacheTag } from "next/cache";
import { prismaClient } from "@/lib/db";
import { createActionResponse } from "@/lib/utils/createActionResponse";

export const getDraftsByUserId = async (userId: string) => {
  "use cache";

  cacheTag(`drafts:${userId}`);
  try {
    const drafts = await prismaClient.lot.findMany({
      where: { scouterId: userId },
    });

    return createActionResponse({ data: drafts });
  } catch (error) {
    return createActionResponse({ error });
  }
};
