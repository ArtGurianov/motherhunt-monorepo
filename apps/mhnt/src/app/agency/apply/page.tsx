import { AgencyApplicationForm } from "@/components/Forms";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AgencyApplicationPage() {
  const headersList = await headers();

  const session = await auth.api.getSession({
    headers: headersList,
  });
  if (!session) {
    redirect("/");
  }

  return (
    <div className="flex flex-col gap-12 grow justify-center items-center py-12 w-full px-4">
      <AgencyApplicationForm />
    </div>
  );
}
