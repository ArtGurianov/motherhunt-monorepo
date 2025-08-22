"use server";

import auth from "@/lib/auth/auth";
import { prismaClient } from "@/lib/db";
import { createActionResponse } from "@/lib/utils/createActionResponse";
import { APIError } from "better-auth/api";
import { headers } from "next/headers";
import { ORG_TYPES } from "@/lib/utils/types";
import { User } from "better-auth";

export const getBookersList = async () => {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });
    if (!session)
      throw new APIError("UNAUTHORIZED", { message: "Unauthorized" });

    const {
      session: { activeOrganizationId, activeOrganizationType },
    } = session;

    if (!activeOrganizationId || activeOrganizationType !== ORG_TYPES.AGENCY)
      throw new APIError("FORBIDDEN", { message: "Incorrect agency data" });

    const membersList = await prismaClient.member.findMany({
      where: { organizationId: activeOrganizationId },
    });

    const usersList = membersList.length
      ? await prismaClient.user.findMany({
          where: { id: { in: membersList.map((each) => each.userId) } },
        })
      : [];

    const usersMap = usersList.reduce(
      (temp, next) => ({
        ...temp,
        [next.id]: next,
      }),
      {} as Record<string, User>
    );

    const bookersData = membersList.reduce(
      (temp, { role, userId, id }) => [
        ...temp,
        {
          role,
          email: usersMap[userId]?.email ?? "unknown email",
          memberId: id,
        },
      ],
      [] as Array<{ role: string; email: string; memberId: string }>
    );

    return createActionResponse({ data: bookersData });
  } catch (error) {
    return createActionResponse({ error });
  }
};
