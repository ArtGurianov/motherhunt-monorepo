import { auth } from "@/lib/auth/auth";
import { APP_ENTITIES } from "@/lib/auth/permissions/app-permissions";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function SuperadminPage() {
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
        [APP_ENTITIES.ADMIN]: ["create", "update", "ban"],
      },
    },
  });

  if (!permissionResult.success) {
    redirect("/signin");
  }

  return <div>{"Protected"}</div>;
}
