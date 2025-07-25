"use server";

import { Invitation, Member, Organization } from "better-auth/plugins";
import { sendEmail } from "./sendEmail";
import { getAppURL } from "@shared/ui/lib/utils";
import { User } from "better-auth";
import { formatErrorMessage } from "@/lib/utils/createActionResponse";

export const inviteBooker = async ({
  id,
  email,
  organization,
}: {
  id: string;
  role: string;
  email: string;
  organization: Organization;
  invitation: Invitation;
  inviter: Member & {
    user: User;
  };
}) => {
  try {
    await sendEmail({
      to: email,
      subject: `You are invited to join ${organization.name}`,
      meta: {
        description: `Are you a booker of ${organization.name}? Accept your invitation and start booking models now!`,
        link: `${getAppURL()}/agency/accept-invitation/${id}`,
      },
    });
  } catch (error) {
    console.error(formatErrorMessage(error));
  }
};
