import "server-only";

import { prismaClient } from "@/lib/db";
import { ORG_TYPES, OrgMetadata } from "@/lib/utils/types";
import { GenericEndpointContext, User } from "better-auth";
import { ORG_ROLES } from "../permissions/org-permissions";

export const userAfterCreate = async (
  user: User,
  /* eslint-disable @typescript-eslint/no-unused-vars */
  _?: GenericEndpointContext
) => {
  const orgMetadata: OrgMetadata = {
    creatorUserId: user.id,
    orgType: ORG_TYPES.SCOUTING,
  };
  const createdOrg = await prismaClient.organization.create({
    data: {
      name: `scouting-${user.id}`,
      slug: `scouting-${user.id}`,
      metadata: JSON.stringify(orgMetadata),
    },
  });

  await prismaClient.member.create({
    data: {
      userId: user.id,
      organizationId: createdOrg.id,
      role: ORG_ROLES.OWNER_ROLE,
    },
  });

  await prismaClient.user.update({
    where: { id: user.id },
    data: { scoutingOrganizationId: createdOrg.id },
  });
};
