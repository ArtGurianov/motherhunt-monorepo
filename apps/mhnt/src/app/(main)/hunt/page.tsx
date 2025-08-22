import { ScouterWalletAddressForm } from "@/components/Forms";
import { InfoCard } from "@/components/InfoCard/InfoCard";
import { ScouterKarma } from "./_widgets/ScouterKarma";
import { headers } from "next/headers";
import auth from "@/lib/auth/auth";
import { redirect } from "next/navigation";

export default async function HuntPage() {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });
  if (!session) {
    redirect("/sign-in");
  }

  return (
    <InfoCard title={"hunter details"}>
      <ScouterWalletAddressForm />
      <ScouterKarma />
    </InfoCard>
  );
}
