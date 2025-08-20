"use client";

import { useAppWriteContract } from "@/lib/hooks/useAppWriteContract";
import { usdContractAbi } from "@/lib/web3/abi";
import { Button } from "@shared/ui/components/button";
import { GetComponentProps } from "@shared/ui/lib/types";
import { LoaderCircle } from "lucide-react";
import { parseUnits } from "viem";
import { WithWeb3ConnectBtn } from "./WithWeb3ConnectBtn";

interface ApproveTxBtnProps extends GetComponentProps<typeof Button> {
  isLoading: boolean;
  isError: boolean;
  currentAllowanceUsd?: number;
  currentBalanceUsd?: number;
  priceUsd?: number;
  usdContractAddress?: `0x${string}`;
  spenderContractAddress: `0x${string}`;
  decimals?: number;
  onSuccess: () => void;
}

export const ApproveTxBtn = ({
  isLoading,
  isError,
  currentAllowanceUsd,
  currentBalanceUsd,
  priceUsd,
  usdContractAddress,
  spenderContractAddress,
  decimals,
  onSuccess,
  children,
}: ApproveTxBtnProps) => {
  const {
    writeContract,
    isProcessing: isApproveProcessing,
    isError: isApproveError,
  } = useAppWriteContract({
    onSuccess,
  });

  const sendTransaction = () => {
    if (!!usdContractAddress && !!priceUsd && !!decimals) {
      writeContract({
        abi: usdContractAbi,
        address: usdContractAddress,
        functionName: "approve",
        args: [
          spenderContractAddress,
          parseUnits(priceUsd.toString(), decimals),
        ],
      });
    }
  };

  return (
    <WithWeb3ConnectBtn
      className="[&_svg]:size-6"
      disabled={
        isLoading ||
        isError ||
        isApproveError ||
        isApproveProcessing ||
        !usdContractAddress ||
        !decimals ||
        typeof priceUsd !== "number" ||
        typeof currentAllowanceUsd !== "number" ||
        currentAllowanceUsd >= priceUsd ||
        typeof currentBalanceUsd !== "number" ||
        currentBalanceUsd < priceUsd
      }
      onClick={sendTransaction}
    >
      {!isApproveProcessing && !isLoading ? (
        children
      ) : (
        <LoaderCircle className="animate-spin" />
      )}
    </WithWeb3ConnectBtn>
  );
};
