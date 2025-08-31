import { BookerGuardClient } from "@/components/Guards/BookerGuardClient";
import { RoleGuardClient } from "@/components/Guards/RoleGuardClient";
import { CUSTOM_MEMBER_ROLES, CustomMemberRole } from "@/lib/auth/customRoles";
import { prismaClient } from "@/lib/db";
import { ORG_TYPES } from "@/lib/utils/types";
import { StatusCard, StatusCardTypes } from "@shared/ui/components/StatusCard";
import { APIError } from "better-auth/api";
import { ReactNode } from "react";

export async function generateStaticParams() {
  const itemsPerFetch = 100;

  const totalItemsCount = await prismaClient.organization.count({
    where: {
      metadata: {
        contains: ORG_TYPES.AGENCY,
      },
    },
  });
  const iterations = Math.ceil(totalItemsCount / itemsPerFetch);

  const resultData: Array<{ slug: string }> = [];

  for (let iteration = 0; iteration < iterations; iteration++) {
    const iterationResult = await prismaClient.organization.findMany({
      skip: iteration * itemsPerFetch,
      take: itemsPerFetch,
      select: { slug: true },
    });

    resultData.push(...iterationResult);
  }

  return resultData;
}

const ALLOWED_ROLES: CustomMemberRole[] = [
  CUSTOM_MEMBER_ROLES.HEADBOOKER_ROLE,
  CUSTOM_MEMBER_ROLES.BOOKER_ROLE,
];

interface AgencyLayoutProps {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function AgencyLayout({
  children,
  params,
}: AgencyLayoutProps) {
  let userIds: string[] = [];

  try {
    const { slug } = await params;

    const organizationData = await prismaClient.organization.findFirst({
      where: { slug },
    });

    if (!organizationData) {
      throw new APIError("NOT_FOUND", { message: "Organization not found" });
    }

    const membersList = await prismaClient.member.findMany({
      where: { organizationId: organizationData.id },
    });

    userIds = membersList.map(({ userId }) => userId);
  } catch {
    return (
      <StatusCard
        type={StatusCardTypes.ERROR}
        title="Error"
        description="Server error"
        className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
      />
    );
  }

  return (
    <RoleGuardClient allowedRoles={ALLOWED_ROLES}>
      <BookerGuardClient bookersUserIds={userIds}>{children}</BookerGuardClient>
    </RoleGuardClient>
  );
}
