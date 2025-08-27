import auth from "@/lib/auth/auth";
import { CreateAgencyForm } from "@/components/Forms";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { APP_ROUTES_CONFIG } from "@/lib/routes/routes";

export default async function AgencyApplicationPage() {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });
  if (!session) {
    redirect(APP_ROUTES_CONFIG.AUCTION.href);
  }

  return (
    <div className="flex flex-col gap-12 grow justify-center items-center w-full px-4">
      <CreateAgencyForm />
    </div>
  );
}
