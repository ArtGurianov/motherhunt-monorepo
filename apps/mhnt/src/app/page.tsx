import { SignOutBtn } from "@/components/ActionButtons/SignOutBtn";
import { auth } from "@/lib/auth";
import { headers as nextHeaders } from "next/headers";

export default async function HomePage() {
  const headers = await nextHeaders();
  const session = await auth.api.getSession({ headers });

  return (
    <div className="flex flex-col gap-12 grow justify-start items-center py-12">
      {session ? `logged in role: ${session.user.role}` : "logged out"}
      {session ? <SignOutBtn /> : null}
    </div>
  );
}
