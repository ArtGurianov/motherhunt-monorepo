"use client";

import { InfoCard } from "@/components/InfoCard/InfoCard";
import { getEnvConfigClient } from "@/lib/config/env";
import { systemContractAbi } from "@/lib/web3/abi";
import { StatusCard, StatusCardTypes } from "@shared/ui/components/StatusCard";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shared/ui/components/table";
import { LoaderCircle } from "lucide-react";
import { useReadContract } from "wagmi";

export const ManageAdmins = () => {
  const envConfig = getEnvConfigClient();

  const {
    data: projectAdmins,
    isPending: isPendingProjectAdmins,
    isError: isErrorProjectAdmins,
  } = useReadContract({
    abi: systemContractAbi,
    address: envConfig.NEXT_PUBLIC_SYSTEM_CONTRACT_ADDRESS as `0x${string}`,
    functionName: "getProjectAdmins",
  });

  if (isErrorProjectAdmins) {
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
      {isPendingProjectAdmins ? (
        <LoaderCircle className="animate-spin h-12 w-12" />
      ) : (
        <Table>
          <TableCaption className="text-foreground">
            {"Admins of MHNT system"}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">{"address"}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projectAdmins.map((adminAddress) => (
              <TableRow key={adminAddress}>
                <TableCell className="text-center">{adminAddress}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </InfoCard>
  );
};
