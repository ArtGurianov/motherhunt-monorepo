import "server-only";

import { unstable_cacheTag as cacheTag } from "next/cache";
import { prismaClient } from "@/lib/db";
import { cache } from "react";
import { AppBusinessError } from "@/lib/utils/errorUtils";
import { User } from "better-auth";
import { BookersData } from "./types";

export const getAgencyBookersById = cache(async (organizationId: string) => {
  "use cache";
  cacheTag(`bookers:${organizationId}`);

  const organizationData = await prismaClient.organization.findFirst({
    where: { id: organizationId },
  });

  if (!organizationData) {
    throw new AppBusinessError("Organization not found", 404);
  }

  const membersList = await prismaClient.member.findMany({
    where: { organizationId: organizationData.id },
  });

  const userIds = membersList.map(({ userId }) => userId);

  const usersList = membersList.length
    ? await prismaClient.user.findMany({
        where: { id: { in: userIds } },
      })
    : [];

  const usersMap = usersList.reduce(
    (temp, next) => ({
      ...temp,
      [next.id]: next,
    }),
    {} as Record<string, User>
  );

  const bookers = membersList.reduce(
    (temp, { role, userId, id }) => [
      ...temp,
      {
        role,
        email: usersMap[userId]?.email ?? "unknown email",
        memberId: id,
      },
    ],
    [] as BookersData
  );

  return bookers;
});
