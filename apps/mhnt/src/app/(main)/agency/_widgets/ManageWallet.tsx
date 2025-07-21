"use client";

import { InfoCard } from "@/components/InfoCard/InfoCard";

export const ManageWallet = ({}: { organizationId: string }) => {
  // const { address } = useAccount();
  // const {} = useReadContract();

  return (
    <InfoCard title={"wallet"} className="w-auto">
      {"wallet details"}
    </InfoCard>
  );
};
