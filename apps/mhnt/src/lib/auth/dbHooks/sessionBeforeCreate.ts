import "server-only";

import { GenericEndpointContext, Session } from "better-auth";
import { APIError } from "better-auth/api";
import { revalidateTag } from "next/cache";
import { getMemberRole } from "../getMemberRole";

export const sessionBeforeCreate = async (
  session: Session,
  ctx?: GenericEndpointContext,
) => {
  revalidateTag(`session:${session.token}`);

  const user = await ctx?.context.internalAdapter.findUserById(session.userId);
  if (!user) throw new APIError("NOT_FOUND", { message: "User not found" });

  const typedUser = user as unknown as {
    recentOrganizationId: string | null;
    recentOrganizationName: string | null;
    recentOrganizationType: string | null;
  };

  const {
    recentOrganizationId,
    recentOrganizationName,
    recentOrganizationType,
  } = typedUser;

  // Build base session data
  const sessionData = {
    ...session,
    activeOrganizationId: recentOrganizationId,
    activeOrganizationName: recentOrganizationName,
    activeOrganizationType: recentOrganizationType,
  };

  // Get member role if organization is set
  if (recentOrganizationId) {
    const result = await getMemberRole({
      userId: user.id,
      organizationId: recentOrganizationId,
    });
    if (result.success && result.data) {
      return {
        data: {
          ...sessionData,
          activeOrganizationRole: result.data.role,
          activeMemberId: result.data.memberId,
        },
      };
    }
  }

  return { data: sessionData };
};
