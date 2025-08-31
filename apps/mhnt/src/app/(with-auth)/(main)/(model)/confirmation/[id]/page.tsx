import { prismaClient } from "@/lib/db";
import { StatusCard, StatusCardTypes } from "@shared/ui/components/StatusCard";
import { LotConfirmationWidget } from "./_widgets/LotConfirmationWidget";
import { Lot } from "@shared/db";
import { CUSTOM_MEMBER_ROLES } from "@/lib/auth/customRoles";
import { RoleGuardClient } from "@/components/Guards/RoleGuardClient";

const ALLOWED_ROLES = [CUSTOM_MEMBER_ROLES.MODEL_ROLE];

export async function generateStaticParams() {
  const itemsPerFetch = 100;

  const totalItemsCount = await prismaClient.lot.count();
  const iterations = Math.ceil(totalItemsCount / itemsPerFetch);

  const resultData: Array<{ id: string }> = [];

  for (let iteration = 0; iteration < iterations; iteration++) {
    const iterationResult = await prismaClient.lot.findMany({
      skip: iteration * itemsPerFetch,
      take: itemsPerFetch,
      select: { id: true },
    });

    resultData.push(...iterationResult);
  }

  return resultData;
}

interface LotPageProps {
  params: Promise<{ id: string }>;
}

export default async function LotConfirmation(props: LotPageProps) {
  const { id } = await props.params;

  let lotData: Lot | null = null;
  try {
    lotData = await prismaClient.lot.findUnique({ where: { id } });
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

  if (lotData.signedByUserId) {
    return (
      <StatusCard type={StatusCardTypes.ERROR} title="Already confirmed" />
    );
  }

  return (
    <RoleGuardClient allowedRoles={ALLOWED_ROLES}>
      <LotConfirmationWidget data={lotData} />
    </RoleGuardClient>
  );
}
