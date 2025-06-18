"use server";

import { auth } from "@/lib/auth";
import { AGENCY_ROLES } from "@/lib/permissions";

export const createHeadBooker = async ({
  organizationId,
  userEmail,
  userName,
}: {
  organizationId: string;
  userEmail: string;
  userName: string;
}) => {
  const headBooker = await auth.api.createUser({
    body: {
      name: userName,
      email: userEmail,
      password: "",
    },
  });

  //@ts-expect-error https://github.com/better-auth/better-auth/issues/2789
  await auth.api.addMember({
    body: {
      userId: headBooker.user.id,
      organizationId,
      role: AGENCY_ROLES.HEAD_BOOKER,
    },
  });
};
