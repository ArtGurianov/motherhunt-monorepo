import "server-only";

import { cache } from "react";
import { prismaClient } from "@/lib/db";
import { APIError } from "better-auth/api";
// import { unstable_cacheTag as cacheTag } from "next/cache";
import { AppSession } from "./types";
import { getMemberRole } from "@/lib/auth/getMemberRole";

export const getSessionByToken = cache(
  async (token: string): Promise<AppSession> => {
    // "use cache";
    // cacheTag(`session:${token}`);

    const data = await prismaClient.session.findUnique({
      where: { token },
      include: { user: true },
    });
    if (!data) throw new APIError("UNAUTHORIZED", { message: "Unauthorized" });

    const { user, ...session } = data;

    // Enrich session with member role if organization context exists
    if (session.activeOrganizationId && session.activeOrganizationName) {
      const result = await getMemberRole({
        userId: user.id,
        organizationId: session.activeOrganizationId,
      });
      if (result.success && result.data) {
        return {
          user,
          session: {
            ...session,
            activeOrganizationRole: result.data.role,
            activeMemberId: result.data.memberId,
          },
        };
      }
    }

    return { user, session };
  },
);
