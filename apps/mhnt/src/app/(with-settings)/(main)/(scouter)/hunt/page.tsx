import { ScouterWalletAddressForm } from "@/components/Forms";
import { InfoCard } from "@/components/InfoCard/InfoCard";
import { ScouterKarma } from "./_widgets/ScouterKarma";

export default async function HuntPage() {
  return (
    <InfoCard title={"hunter details"}>
      <ScouterWalletAddressForm />
      <ScouterKarma />
    </InfoCard>
  );
}
