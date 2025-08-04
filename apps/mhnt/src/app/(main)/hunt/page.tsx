import { ScouterWalletAddressForm } from "@/components/Forms/ScouterWalletAddressForm";
import { InfoCard } from "@/components/InfoCard/InfoCard";
import { ScouterKarma } from "./_widgets/ScouterKarma";

export default function HuntPage() {
  return (
    <InfoCard title={"hunter details"}>
      <ScouterWalletAddressForm />
      <ScouterKarma />
    </InfoCard>
  );
}
