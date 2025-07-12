import auth from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AcceptInvitationWidget } from "./_widgets/AcceptInvitationWidget";

interface AcceptInvitationPageProps {
  params: Promise<{ invitationId: string }>;
}

export default async function AcceptInvitationPage(
  props: AcceptInvitationPageProps
) {
  const params = await props.params;

  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });
  if (!session) {
    const updatedParams = new URLSearchParams(params);
    updatedParams.set(
      "returnTo",
      `/agency/accept-invitation/${params.invitationId}`
    );
    updatedParams.delete("invitationId");
    redirect(`/sign-in?${updatedParams.toString()}`);
  }

  return <AcceptInvitationWidget invitationId={params.invitationId} />;
}
