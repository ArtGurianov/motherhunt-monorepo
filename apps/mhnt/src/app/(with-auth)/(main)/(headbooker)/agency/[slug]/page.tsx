import { ManageBookers } from "./_widgets/ManageBookers";
import { InfoCard } from "@/components/InfoCard/InfoCard";
import { AgencyWalletAddressForm } from "@/components/Forms";
import { StatusCard, StatusCardTypes } from "@shared/ui/components/StatusCard";
import { prismaClient } from "@/lib/db";
import { User } from "@shared/db";
import { ORG_TYPES } from "@/lib/utils/types";
import { APIError } from "better-auth/api";

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

export type BookersData = Array<{
  role: string;
  email: string;
  memberId: string;
}>;
interface AgencyDetailsPageProps {
  params: Promise<{ slug: string }>;
}

export default async function AgencyDetailsPage({
  params,
}: AgencyDetailsPageProps) {
  let bookersData: BookersData = [];

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

    const userIds = membersList.map(({ userId }) => userId);

    const usersList = membersList.length
      ? await prismaClient.user.findMany({
          where: { id: { in: userIds } },
        })
      : [];

    const usersMap = usersList.reduce(
      (temp, next) => ({
        ...temp,
        [next.id]: next,
      }),
      {} as Record<string, User>
    );

    bookersData = membersList.reduce(
      (temp, { role, userId, id }) => [
        ...temp,
        {
          role,
          email: usersMap[userId]?.email ?? "unknown email",
          memberId: id,
        },
      ],
      [] as BookersData
    );
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
    <>
      <ManageBookers data={bookersData} />
      <InfoCard title={"wallet"}>
        <AgencyWalletAddressForm />
      </InfoCard>
    </>
  );
}
