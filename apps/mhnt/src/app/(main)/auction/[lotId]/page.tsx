import auth from "@/lib/auth/auth";
import { prismaClient } from "@/lib/db";
import { StatusCard, StatusCardTypes } from "@shared/ui/components/StatusCard";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { LotContent } from "./_widgets/LotContent";

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

  return <LotContent lotData={lotData} />;
}
