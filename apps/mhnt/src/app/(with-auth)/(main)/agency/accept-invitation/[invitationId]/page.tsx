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

  // const headersList = await headers();
  // const session = await auth.api.getSession({
  //   headers: headersList,
  // });
  // if (!session) {
  //   const updatedParams = new URLSearchParams({ invitationId });
  //   updatedParams.set("returnTo", `/agency/accept-invitation/${invitationId}`);
  //   updatedParams.delete("invitationId");
  //   redirect(`/sign-in?${updatedParams.toString()}`);
  // }

  const invitationDetails = await prismaClient.invitation.findUnique({
    where: { id },
  });

  if (!invitationDetails) {
    return (
      <StatusCard type={StatusCardTypes.ERROR} title="Invitation Not Found" />
    );
  }

  // if (invitationDetails.email !== session.user.email) {
  //   return (
  //     <StatusCard type={StatusCardTypes.ERROR} title="Not an invitee email!" />
  //   );
  // }

  if (invitationDetails.status !== "pending") {
    return <StatusCard type={StatusCardTypes.ERROR} title="Already Accepted" />;
  }

  // if (
  //   session.session.activeOrganizationId === invitationDetails.organizationId
  // ) {
  //   return <StatusCard type={StatusCardTypes.ERROR} title="Already a member" />;
  // }

  // const memberships = await prismaClient.member.findMany({
  //   where: { userId: session.session.userId },
  // });

  // for (const membership of memberships) {
  //   if (membership.organizationId === invitationDetails.organizationId) {
  //     return (
  //       <StatusCard type={StatusCardTypes.ERROR} title="Already a member" />
  //     );
  //   }
  // }

  return <AcceptInvitationWidget invitationId={id} />;
}
