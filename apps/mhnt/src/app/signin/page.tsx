import { SignInForm } from "@/components/Forms";
import { auth } from "@/lib/auth/auth";
import { getTurnstileValues } from "@/lib/utils/getTurnstileValues";
import { headers as nextHeaders } from "next/headers";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const headers = await nextHeaders();
  const { userIp, turnstileToken } = getTurnstileValues(headers);

  const session = await auth.api.getSession({ headers });
  if (session) redirect("/");

  return (
    <div className="flex flex-col gap-12 grow justify-start items-center py-12">
      <SignInForm userIp={userIp!} turnstileToken={turnstileToken!} />
    </div>
  );
}
