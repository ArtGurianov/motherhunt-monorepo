import { SignOutBtn } from "@/components/ActionButtons/SignOutBtn";
import { auth } from "@/lib/auth/auth";
import { headers as nextHeaders } from "next/headers";

export default async function HomePage() {
  const headers = await nextHeaders();
  const session = await auth.api.getSession({ headers });

  return (
    <div className="flex w-full items-center justify-center h-[1500px]">
      {session ? `logged in role: ${session.user.role}` : "logged out"}
      {session ? <SignOutBtn /> : null}
    </div>
  );
}
