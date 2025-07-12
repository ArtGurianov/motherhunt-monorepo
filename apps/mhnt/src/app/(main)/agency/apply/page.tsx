import auth from "@/lib/auth/auth";
import { CreateAgencyForm } from "@/components/Forms";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AgencyApplicationPage() {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });
  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="flex flex-col gap-12 grow justify-center items-center w-full px-4">
      <CreateAgencyForm />
    </div>
  );
}
