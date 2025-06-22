"use server";

import { auth } from "@/lib/auth/auth";
import { sendEmail } from "./sendEmail";
import { AGENCY_ROLES } from "@/lib/auth/permissions/agency-permissions";
import { getAppURL } from "@shared/ui/lib/utils";

export const initializeHeadBooker = async ({
  headBookerId,
  headBookerEmail,
  organizationId,
}: {
  headBookerId: string;
  headBookerEmail: string;
  organizationId: string;
}) => {
  //@ts-expect-error https://github.com/better-auth/better-auth/issues/2789
  await auth.api.addMember({
    body: {
      userId: headBookerId,
      organizationId,
      role: AGENCY_ROLES.HEAD_BOOKER,
    },
  });

  await sendEmail({
    to: headBookerEmail,
    subject: "Organization Setup",
    meta: {
      description:
        "Your agency profile is created. You can now login and start hunting!",
      link: `${getAppURL()}/signin`,
    },
  });
};
