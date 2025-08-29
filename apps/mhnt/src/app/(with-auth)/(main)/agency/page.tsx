import { ManageBookers } from "./_widgets/ManageBookers";
import { InfoCard } from "@/components/InfoCard/InfoCard";
import { AgencyWalletAddressForm } from "@/components/Forms";
import { headers } from "next/headers";
import auth from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { ORG_TYPES } from "@/lib/utils/types";
import { StatusCard, StatusCardTypes } from "@shared/ui/components/StatusCard";
import { prismaClient } from "@/lib/db";
import { User } from "@shared/db";
import { APP_ROUTES, APP_ROUTES_CONFIG } from "@/lib/routes/routes";

export type BookersData = Array<{
  role: string;
  email: string;
  memberId: string;
}>;

export default async function AgencyManagePage() {
  let bookersData: BookersData = [];
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });
    if (!session) redirect(APP_ROUTES_CONFIG[APP_ROUTES.AUCTION].href);

    const {
      session: { activeOrganizationId, activeOrganizationType },
    } = session;

    if (!activeOrganizationId || activeOrganizationType !== ORG_TYPES.AGENCY)
      return (
        <StatusCard
          type={StatusCardTypes.ERROR}
          title="Error"
          description="Access Denied"
          className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
        />
      );

    const membersList = await prismaClient.member.findMany({
      where: { organizationId: activeOrganizationId },
    });

    const usersList = membersList.length
      ? await prismaClient.user.findMany({
          where: { id: { in: membersList.map((each) => each.userId) } },
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
