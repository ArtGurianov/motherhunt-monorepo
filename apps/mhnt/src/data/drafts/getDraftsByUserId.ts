import "server-only";

import { unstable_cacheTag as cacheTag } from "next/cache";
import { prismaClient } from "@/lib/db";
import { cache } from "react";

export const getDraftsByUserId = cache(async (userId: string) => {
  "use cache";
  cacheTag(`drafts:${userId}`);

  const drafts = await prismaClient.lot.findMany({
    where: { scouterId: userId },
  });

  return drafts;
});
