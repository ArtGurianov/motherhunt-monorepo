import { ScouterWalletAddressForm } from "@/components/Forms/ScouterWalletAddressForm";
import { InfoCard } from "@/components/InfoCard/InfoCard";

export default function HuntPage() {
  return (
    <div className="flex flex-col gap-8">
      <InfoCard title={"hunter details"} className="w-auto">
        <ScouterWalletAddressForm />
      </InfoCard>
    </div>
  );
}
