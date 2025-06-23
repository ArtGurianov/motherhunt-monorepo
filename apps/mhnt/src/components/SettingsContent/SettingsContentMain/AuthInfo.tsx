import { auth } from "@/lib/auth/auth";
import { headers as nextHeaders } from "next/headers";
import { redirect } from "next/navigation";

export const AuthInfo = async () => {
  const headers = await nextHeaders();
  const session = await auth.api.getSession({ headers });
  if (!session) redirect("/signin");

  return (
    <div className="flex flex-col">
      <span>{"Currently logged in as:"}</span>
      <span>{session.user.role}</span>
    </div>
  );
};
