import { InfoCard } from "@/components/InfoCard/InfoCard";
import auth from "@/lib/auth/auth";
import { prismaClient } from "@/lib/db";
import { StatusCard, StatusCardTypes } from "@shared/ui/components/StatusCard";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

interface LotPageProps {
  params: Promise<{ lotId: string }>;
}

export default async function LotPage(props: LotPageProps) {
  const { lotId } = await props.params;

  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });
  if (!session) redirect("/sign-in");

  const lotData = await prismaClient.lot.findUnique({ where: { id: lotId } });
  if (!lotData)
    return <StatusCard type={StatusCardTypes.ERROR} title="Lot not found" />;

  if (lotData.scouterId !== session.session.userId)
    return (
      <StatusCard type={StatusCardTypes.ERROR} title="Not a lot creator!" />
    );

  return (
    <>
      <InfoCard title={"model profile"}>
        {lotId}
        {"model profile data"}
      </InfoCard>
      <InfoCard title={"model signature"}>
        {"request email confirmation"}
      </InfoCard>
      <InfoCard title={"review"}>{"submit to onchain review voting"}</InfoCard>
      <InfoCard title={"publish"}>{"publish to auction"}</InfoCard>
    </>
  );
}
