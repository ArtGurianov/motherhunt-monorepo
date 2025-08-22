"use server";

import { APIError } from "better-auth/api";
import {
  ORG_ENTITIES,
  ORG_ROLES,
} from "@/lib/auth/permissions/org-permissions";
import { prismaClient } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createActionResponse } from "@/lib/utils/createActionResponse";
import { ORG_TYPES, OrgMetadata } from "@/lib/utils/types";
import { AppClientError } from "@shared/ui/lib/utils/appClientError";
import { canAccessCustomRole } from "@/lib/auth/permissions/checkers";
import { CUSTOM_MEMBER_ROLES, CustomMemberRole } from "@/lib/auth/customRoles";

const ALLOWED_CUSTOM_ROLES: CustomMemberRole[] = [
  CUSTOM_MEMBER_ROLES.HEADBOOKER_ROLE,
] as const;

export const deleteBookerRole = async (targetId: string) => {
  try {
    const result = await canAccessCustomRole(
      ORG_ENTITIES.MEMBER,
      "delete",
      ALLOWED_CUSTOM_ROLES
    );
    if (!result.canAccess)
      throw new APIError("FORBIDDEN", { message: "Access Denied" });

    const { organizationId } = result;

    const member = await prismaClient.member.findFirst({
      where: { id: targetId },
    });
    if (!member)
      throw new APIError("NOT_FOUND", { message: "Member not found" });

    if (member.organizationId !== organizationId) {
      throw new APIError("FORBIDDEN", { message: "Access Denied" });
    }

    const organization = await prismaClient.organization.findUnique({
      where: { id: member.organizationId },
    });

    if (!organization?.metadata)
      throw new APIError("NOT_FOUND", {
        message: "Organization data not found",
      });

    if (
      (JSON.parse(organization.metadata) as OrgMetadata).orgType !==
      ORG_TYPES.AGENCY
    ) {
      throw new AppClientError("Not an agency organization");
    }

    await prismaClient.member.delete({
      where: { id: targetId, role: ORG_ROLES.MEMBER_ROLE },
    });

    const bookerSession = await prismaClient.session.findFirst({
      where: { activeMemberId: targetId },
    });

    if (bookerSession) {
      await prismaClient.session.delete({
        where: { id: bookerSession.id },
      });
    }

    revalidatePath("/agency");

    return createActionResponse();
  } catch (error) {
    return createActionResponse({ error });
  }
};
