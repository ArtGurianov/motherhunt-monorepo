import { CreateAgencyForm } from "@/components/Forms";
import { auth } from "@/lib/auth/auth";
import { AGENCY_ENTITIES } from "@/lib/auth/permissions/agency-permissions";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AgenciesCasesPage() {
  const headersList = await headers();

  const session = await auth.api.getSession({
    headers: headersList,
  });
  if (!session) {
    redirect("/");
  }

  const permissionResult = await auth.api.userHasPermission({
    headers: headersList,
    body: {
      userId: session.user.id,
      permissions: {
        [AGENCY_ENTITIES.AGENCY_ORGANIZATION]: ["create"],
        [AGENCY_ENTITIES.AGENCY_HEAD_BOOKER]: ["create"],
      },
    },
  });

  if (!permissionResult.success) {
    redirect("/signin");
  }

  return (
    <div className="flex flex-col gap-12 grow justify-start items-center py-12">
      <CreateAgencyForm />
    </div>
  );
}
