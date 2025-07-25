import { canViewHeadBooker } from "@/lib/auth/permissions/checkers";
import { ManageBookers } from "./_widgets/ManageBookers";
import { StatusCard, StatusCardTypes } from "@shared/ui/components/StatusCard";
import { getTranslations } from "next-intl/server";
import { getAppLocale } from "@shared/ui/lib/utils";
import { prismaClient } from "@/lib/db";
import { User } from "@shared/db";
import { InfoCard } from "@/components/InfoCard/InfoCard";
import { AgencyWalletAddressForm } from "@/components/Forms/AgencyWalletAddressForm";

const locale = getAppLocale();

export default async function AgencyManagePage() {
  const { canAccess, organizationId } = await canViewHeadBooker();
  if (!canAccess || !organizationId) {
    const t = await getTranslations({ locale, namespace: "TOASTS" });
    return (
      <StatusCard type={StatusCardTypes.ERROR} title={t("ACCESS_DENIED")} />
    );
  }

  const bookersList = await prismaClient.member.findMany({
    where: { organizationId },
  });
  const usersList = bookersList.length
    ? await prismaClient.user.findMany({
        where: { id: { in: bookersList.map((each) => each.userId) } },
      })
    : [];

  const usersMap = usersList.reduce(
    (temp, next) => ({
      ...temp,
      [next.id]: next,
    }),
    {} as Record<string, User>
  );

  const bookersData = bookersList.reduce(
    (temp, { role, userId, id }) => [
      ...temp,
      { role, email: usersMap[userId]?.email ?? "unknown email", memberId: id },
    ],
    [] as Array<{ role: string; email: string; memberId: string }>
  );

  return (
    <div className="flex flex-col gap-8">
      <ManageBookers bookersData={bookersData} />
      <InfoCard title={"wallet"} className="w-auto">
        <AgencyWalletAddressForm organizationId={organizationId} />
      </InfoCard>
    </div>
  );
}
