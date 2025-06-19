"use server";

import { auth } from "@/lib/auth/auth";
import { sendEmail } from "./sendEmail";
import { AGENCY_ROLES } from "@/lib/auth/permissions/agency-permissions";
import { getAppURL } from "@shared/ui/lib/utils";

export const initializeHeadBooker = async ({
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

  await sendEmail({
    to: userEmail,
    subject: "Organization Setup",
    meta: {
      description:
        "Your agency profile is created. You can now login and start hunting!",
      link: `${getAppURL()}/signin`,
    },
  });
};
