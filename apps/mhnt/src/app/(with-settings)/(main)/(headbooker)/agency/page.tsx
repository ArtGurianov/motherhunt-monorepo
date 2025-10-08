import { ManageBookers } from "./_widgets/ManageBookers";
import { InfoCard } from "@/components/InfoCard/InfoCard";
import { AgencyWalletAddressForm } from "@/components/Forms";

export default async function AgencyDetailsPage() {
  return (
    <>
      <ManageBookers />
      <InfoCard title={"wallet"}>
        <AgencyWalletAddressForm />
      </InfoCard>
    </>
  );
}
