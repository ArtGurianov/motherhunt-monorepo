import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminsPage() {
  const headersList = await headers();

  const session = await auth.api.getSession({
    headers: headersList,
  });
  if (!session) {
    redirect("/");
  }

  return <div>{"Protected"}</div>;
}
