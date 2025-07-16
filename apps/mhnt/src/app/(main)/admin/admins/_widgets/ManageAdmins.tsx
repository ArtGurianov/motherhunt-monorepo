"use client";

import { InfoCard } from "@/components/InfoCard/InfoCard";
import { getEnvConfigClient } from "@/lib/config/env";
import { systemContractAbi } from "@/lib/web3/abi";
import { StatusCard, StatusCardTypes } from "@shared/ui/components/StatusCard";
import { LoaderCircle } from "lucide-react";
import { useReadContract } from "wagmi";

export const ManageAdmins = () => {
  const envConfig = getEnvConfigClient();

  const {
    data: activeAdmins,
    isPending: isPendingActiveAdmins,
    isError: isErrorActiveAdmins,
    error,
  } = useReadContract({
    abi: systemContractAbi,
    address: envConfig.NEXT_PUBLIC_SYSTEM_CONTRACT_ADDRESS as `0x${string}`,
    functionName: "getActiveAdmins",
  });

  if (isErrorActiveAdmins) {
    console.log(error.details);
    return (
      <StatusCard
        type={StatusCardTypes.ERROR}
        title="Error"
        description="An error occured while fetching data from blockchain"
        className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
      />
    );
  }

  return (
    <InfoCard
      title={"admins"}
      className="w-auto flex justify-center items-center"
    >
      {isPendingActiveAdmins ? (
        <LoaderCircle className="animate-spin h-12 w-12" />
      ) : (
        <ul>
          {activeAdmins.map((each) => (
            <li key={each}>{each}</li>
          ))}
        </ul>
      )}
    </InfoCard>
  );
};
