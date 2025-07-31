"use client";

import { authClient } from "@/lib/auth/authClient";
import { useAppWriteContract } from "@/lib/hooks/useAppWriteContract";
import { karmaContractAbi } from "@/lib/web3/abi";
import { stringToBytes32 } from "@/lib/web3/stringToBytes32";
import { Button } from "@shared/ui/components/button";
import { GetComponentProps } from "@shared/ui/lib/types";
import { LoaderCircle } from "lucide-react";

interface TopUpKarmaBtnProps extends GetComponentProps<typeof Button> {
  isLoading: boolean;
  isError: boolean;
  currentAllowanceUsd?: number;
  currentBalanceUsd?: number;
  priceUsd?: number;
  spenderContractAddress: `0x${string}`;
  onSuccess: () => void;
}

export const TopUpKarmaBtn = ({
  isLoading,
  isError,
  currentAllowanceUsd,
  currentBalanceUsd,
  priceUsd,
  spenderContractAddress,
  onSuccess,
  children,
}: TopUpKarmaBtnProps) => {
  const { isPending: isSessionPending, data: sessionData } =
    authClient.useSession();

  const {
    writeContract,
    isProcessing: isPurchaseProcessing,
    isError: isPurchaseError,
  } = useAppWriteContract({
    onSuccess,
  });

  const sendTransaction = () => {
    if (sessionData) {
      writeContract({
        abi: karmaContractAbi,
        address: spenderContractAddress,
        functionName: "purchase",
        args: [stringToBytes32(sessionData.session.userId)],
      });
    }
  };

  return (
    <Button
      className="[&_svg]:size-6"
      disabled={
        isSessionPending ||
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
      {!isPurchaseProcessing && !isSessionPending && !isLoading ? (
        children
      ) : (
        <LoaderCircle className="animate-spin" />
      )}
    </Button>
  );
};
