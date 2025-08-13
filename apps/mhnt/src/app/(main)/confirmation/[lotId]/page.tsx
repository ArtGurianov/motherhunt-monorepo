import { prismaClient } from "@/lib/db";
import { StatusCard, StatusCardTypes } from "@shared/ui/components/StatusCard";
import { LotConfirmationWidget } from "./_widgets/LotConfirmationWidget";
import { Lot } from "@shared/db";

interface LotPageProps {
  params: Promise<{ lotId: string }>;
}

export default async function LotConfirmation(props: LotPageProps) {
  let lotData: Lot | null = null;
  try {
    const { lotId } = await props.params;
    lotData = await prismaClient.lot.findUnique({ where: { id: lotId } });
  } catch {
    return (
      <StatusCard
        type={StatusCardTypes.ERROR}
        title="Error during fetching profile data"
      />
    );
  }

  if (!lotData)
    return (
      <StatusCard type={StatusCardTypes.ERROR} title="Profile not found" />
    );

  if (!lotData.isConfirmationEmailSent) {
    return (
      <StatusCard
        type={StatusCardTypes.ERROR}
        title="Confirmation not available"
      />
    );
  }

  if (lotData.isConfirmationSigned) {
    return (
      <StatusCard type={StatusCardTypes.ERROR} title="Already confirmed" />
    );
  }

  return <LotConfirmationWidget />;
}
