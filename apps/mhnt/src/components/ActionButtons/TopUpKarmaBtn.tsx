"use client";

import { useAppWriteContract } from "@/lib/hooks";
import { karmaContractAbi } from "@/lib/web3/abi";
import { stringToBytes32 } from "@/lib/web3/stringToBytes32";
import { Button } from "@shared/ui/components/button";
import { GetComponentProps } from "@shared/ui/lib/types";
import { LoaderCircle } from "lucide-react";
import { Web3ConnectBtn } from "./Web3ConnectBtn";
import { useAuth } from "../AppProviders/AuthProvider";

interface TopUpKarmaBtnProps extends GetComponentProps<typeof Button> {
  isLoading: boolean;
  isError: boolean;
  currentAllowanceUsd?: number;
  currentBalanceUsd?: number;
  priceUsd?: number;
  callContractAddress: `0x${string}`;
  onSuccess: () => void;
}

export const TopUpKarmaBtn = ({
  isLoading,
  isError,
  currentAllowanceUsd,
  currentBalanceUsd,
  priceUsd,
  callContractAddress,
  onSuccess,
  children,
}: TopUpKarmaBtnProps) => {
  const { session } = useAuth();

  const {
    writeContract,
    isProcessing: isPurchaseProcessing,
    isError: isPurchaseError,
  } = useAppWriteContract({
    onSuccess,
  });

  const sendTransaction = () => {
    writeContract({
      abi: karmaContractAbi,
      address: callContractAddress,
      functionName: "purchase",
      args: [stringToBytes32(session.userId)],
    });
  };

  return (
    <Web3ConnectBtn
      className="[&_svg]:size-6"
      disabled={
        isError ||
        isPurchaseError ||
        isPurchaseProcessing ||
        !priceUsd ||
        typeof currentAllowanceUsd !== "number" ||
        currentAllowanceUsd < priceUsd ||
        typeof currentBalanceUsd !== "number" ||
        currentBalanceUsd < priceUsd
      }
      onClick={() => {
        sendTransaction();
      }}
    >
      {!isPurchaseProcessing && !isLoading ? (
        children
      ) : (
        <LoaderCircle className="animate-spin" />
      )}
    </Web3ConnectBtn>
  );
};
