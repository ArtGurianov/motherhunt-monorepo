import "server-only";

import { GenericEndpointContext, Session } from "better-auth";
import { APIError } from "better-auth/api";
import { getSessionToken } from "../getSessionToken";
import { revalidateTag } from "next/cache";

export const sessionBeforeCreate = async (
  session: Session,
  ctx?: GenericEndpointContext
) => {
  if (ctx?.headers) {
    const token = await getSessionToken(ctx.headers);
    revalidateTag(`session:${token}`);
  }

  const user = await ctx?.context.internalAdapter.findUserById(session.userId);
  if (!user) throw new APIError("NOT_FOUND", { message: "User not found" });

  return {
    data: {
      ...session,
      activeOrganizationId: (
        user as unknown as {
          recentOrganizationId: string | null;
        }
      ).recentOrganizationId,
      activeOrganizationName: (
        user as unknown as {
          recentOrganizationName: string | null;
        }
      ).recentOrganizationName,
      activeOrganizationType: (
        user as unknown as {
          recentOrganizationType: string | null;
        }
      ).recentOrganizationType,
    },
  };
};
