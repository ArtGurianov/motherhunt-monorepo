"use client";

import { DangerousActionDialog } from "@/components/DangerousActionDialog/DangerousActionDialog";
import { AddSuperAdminForm } from "@/components/Forms";
import { InfoCard } from "@/components/InfoCard/InfoCard";
import { getEnvConfigClient } from "@/lib/config/env";
import { useAppWriteContract } from "@/lib/hooks";
import { APP_ROUTES, APP_ROUTES_CONFIG } from "@/lib/routes/routes";
import { buildDynamicRoutePath } from "@/lib/utils/buildDynamicRoutePath";
import { systemContractAbi } from "@/lib/web3/abi";
import { Button } from "@shared/ui/components/button";
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
import { Ban, Eye, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useReadContract } from "wagmi";

export const ManageSuperAdmins = () => {
  const envConfig = getEnvConfigClient();
  const [revokeSuperAdminAddress, setRevokeSuperAdminAddress] = useState<
    string | null
  >(null);

  const {
    data: projectSuperAdmins,
    isPending: isPendingProjectSuperAdmins,
    isError: isErrorProjectSuperAdmins,
    refetch: refetchProjectSuperAdmins,
  } = useReadContract({
    abi: systemContractAbi,
    address: envConfig.NEXT_PUBLIC_SYSTEM_CONTRACT_ADDRESS as `0x${string}`,
    functionName: "getProjectSuperAdmins",
  });

  const { writeContract, isProcessing } = useAppWriteContract({
    onSuccess: () => {
      refetchProjectSuperAdmins();
      setRevokeSuperAdminAddress(null);
    },
  });

  if (isErrorProjectSuperAdmins) {
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
    <InfoCard title={"superadmins"}>
      {isPendingProjectSuperAdmins ? (
        <div className="w-full flex justify-center items-center">
          <LoaderCircle className="animate-spin h-12 w-12" />
        </div>
      ) : (
        <Table>
          <TableCaption className="text-foreground">
            {"Super Admins of MHNT system"}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">{"address"}</TableHead>
              <TableHead className="text-center">{"logs"}</TableHead>
              <TableHead className="text-center">{"revoke"}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projectSuperAdmins.map((adminAddress) => (
              <TableRow key={adminAddress}>
                <TableCell className="text-center">{adminAddress}</TableCell>
                <TableCell>
                  <div className="w-full flex justify-center items-center">
                    <Button
                      asChild
                      size="reset"
                      className="p-px [&_svg]:size-6"
                    >
                      <Link
                        href={buildDynamicRoutePath(
                          APP_ROUTES_CONFIG[APP_ROUTES.SUPERADMIN_DETAILS].href,
                          { address: adminAddress },
                        )}
                      >
                        <Eye />
                      </Link>
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="w-full flex justify-center items-center">
                    <Button
                      disabled={isProcessing}
                      size="reset"
                      className="p-px [&_svg]:size-6"
                      onClick={() => {
                        setRevokeSuperAdminAddress(adminAddress);
                      }}
                    >
                      {isProcessing ? (
                        <LoaderCircle className="py-1 animate-spin h-8 w-8" />
                      ) : (
                        <Ban />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <AddSuperAdminForm onRefetchSuperAdmins={refetchProjectSuperAdmins} />
      <DangerousActionDialog
        title="Revoke Super Admin"
        desctiption={revokeSuperAdminAddress ?? "unknown address"}
        isOpen={!!revokeSuperAdminAddress}
        onClose={() => setRevokeSuperAdminAddress(null)}
        onActionConfirm={() => {
          if (revokeSuperAdminAddress) {
            writeContract({
              abi: systemContractAbi,
              address: getEnvConfigClient()
                .NEXT_PUBLIC_SYSTEM_CONTRACT_ADDRESS as `0x${string}`,
              functionName: "revokeProjectSuperAdmin",
              args: [revokeSuperAdminAddress as `0x${string}`],
            });
          }
        }}
      />
    </InfoCard>
  );
};
