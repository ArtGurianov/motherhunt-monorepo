"use client";

import { authClient } from "@/lib/auth/authClient";
import { useAppWriteContract } from "@/lib/hooks/useAppWriteContract";
import { karmaContractAbi } from "@/lib/web3/abi";
import { stringToBytes32 } from "@/lib/web3/stringToBytes32";
import { Button } from "@shared/ui/components/button";
import { GetComponentProps } from "@shared/ui/lib/types";

interface TopUpKarmaBtnProps extends GetComponentProps<typeof Button> {
  currentAllowanceUsd?: number;
  currentBalanceUsd?: number;
  priceUsd?: number;
  spenderContractAddress: `0x${string}`;
  onSuccess: () => void;
  onError: () => void;
}

export const TopUpKarmaBtn = ({
  currentAllowanceUsd,
  currentBalanceUsd,
  priceUsd,
  spenderContractAddress,
  onSuccess,
  onError,
  children,
}: TopUpKarmaBtnProps) => {
  const { isPending: isSessionPending, data: sessionData } =
    authClient.useSession();

  const { writeContract, isProcessing, hash, receipt, isError } =
    useAppWriteContract({
      onSuccess,
      onError,
      onRevert: onError,
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
      disabled={
        isSessionPending ||
        isError ||
        isProcessing ||
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
      {!isProcessing && !isSessionPending ? children : "waiting..."}
    </Button>
  );
};
