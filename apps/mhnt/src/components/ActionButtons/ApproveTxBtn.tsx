"use client";

import { useAppWriteContract } from "@/lib/hooks/useAppWriteContract";
import { usdContractAbi } from "@/lib/web3/abi";
import { Button } from "@shared/ui/components/button";
import { GetComponentProps } from "@shared/ui/lib/types";
import { parseUnits } from "viem";

interface ApproveTxBtnProps extends GetComponentProps<typeof Button> {
  currentAllowanceUsd?: number;
  currentBalanceUsd?: number;
  priceUsd?: number;
  usdContractAddress?: `0x${string}`;
  spenderContractAddress: `0x${string}`;
  decimals?: number;
  onSuccess: () => void;
  onError: () => void;
}

export const ApproveTxBtn = ({
  currentAllowanceUsd,
  currentBalanceUsd,
  priceUsd,
  usdContractAddress,
  spenderContractAddress,
  decimals,
  onSuccess,
  onError,
  children,
}: ApproveTxBtnProps) => {
  const { writeContract, isProcessing, hash, receipt, isError } =
    useAppWriteContract({
      onSuccess,
      onError,
      onRevert: onError,
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
    <Button
      disabled={
        isError ||
        isProcessing ||
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
      {!isProcessing ? children : "loading..."}
    </Button>
  );
};
