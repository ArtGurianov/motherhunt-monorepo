import { AcceptInvitationWidget } from "./_widgets/AcceptInvitationWidget";
import { prismaClient } from "@/lib/db";
import { StatusCard, StatusCardTypes } from "@shared/ui/components/StatusCard";

export async function generateStaticParams() {
  const itemsPerFetch = 100;

  const totalItemsCount = await prismaClient.invitation.count();
  const iterations = Math.ceil(totalItemsCount / itemsPerFetch);

  const resultData: Array<{ id: string }> = [];

  for (let iteration = 0; iteration < iterations; iteration++) {
    const iterationResult = await prismaClient.invitation.findMany();

    resultData.push(...iterationResult);
  }

  return resultData;
}

interface AcceptInvitationPageProps {
  params: Promise<{ id: string }>;
}

export default async function AcceptInvitationPage(
  props: AcceptInvitationPageProps
) {
  const { id } = await props.params;

  const invitationDetails = await prismaClient.invitation.findUnique({
    where: { id },
  });

  if (!invitationDetails) {
    return (
      <StatusCard type={StatusCardTypes.ERROR} title="Invitation Not Found" />
    );
  }

  if (invitationDetails.status !== "pending") {
    return (
      <StatusCard type={StatusCardTypes.ERROR} title="Invitation Closed" />
    );
  }

  return (
    <AcceptInvitationWidget
      invitationId={id}
      inviteeEmail={invitationDetails.email}
    />
  );
}
