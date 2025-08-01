"use server";

import { GenericEndpointContext, Session } from "better-auth";
import { APIError } from "better-auth/api";

export const sessionBeforeCreate = async (
  session: Session,
  ctx?: GenericEndpointContext
) => {
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
    },
  };
};
