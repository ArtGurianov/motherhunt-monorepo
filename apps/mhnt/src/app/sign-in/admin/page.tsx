import { AdminSignInForm } from "@/components/Forms/AdminSignInForm";
import auth from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminSignInPage() {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });
  if (session) redirect("/");

  return (
    <div className="flex justify-center items-center w-full h-[calc(var(--height-content)+var(--height-nav))] px-2">
      <AdminSignInForm />
    </div>
  );
}
