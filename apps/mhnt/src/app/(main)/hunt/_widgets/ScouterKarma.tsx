"use client";

import { authClient } from "@/lib/auth/authClient";
import { getEnvConfigClient } from "@/lib/config/env";
import { useAppWriteContract } from "@/lib/hooks/useAppWriteContract";
import { karmaContractAbi } from "@/lib/web3/abi";
import { stringToBytes32 } from "@/lib/web3/stringToBytes32";
import { Button } from "@shared/ui/components/button";
import {
  InlineData,
  InlineDataContent,
  InlineDataLabel,
} from "@shared/ui/components/InlineData";
import { LoaderCircle } from "lucide-react";
import { useTransition } from "react";
import { useReadContract } from "wagmi";

export const ScouterKarma = () => {
  const [isPending, startTransition] = useTransition();

  const { isPending: isSessionPending, data: sessionData } =
    authClient.useSession();

  const {
    data: karmaBalance,
    isPending: isKarmaBalancePending,
    isError: isKarmaBalanceError,
    refetch: refetchKarmaBalance,
  } = useReadContract({
    abi: karmaContractAbi,
    address: getEnvConfigClient()
      .NEXT_PUBLIC_KARMA_CONTRACT_ADDRESS as `0x${string}`,
    functionName: "balanceOf",
    args: [stringToBytes32(sessionData?.session.userId ?? "")],
    query: {
      enabled: !!sessionData?.session.userId && !isSessionPending,
    },
  });

  const { writeContract, isProcessing } = useAppWriteContract({
    onSuccess: (receipt) => {
      startTransition(async () => {
        refetchKarmaBalance();
      });
    },
  });

  return (
    <InlineData>
      <InlineDataLabel>{"Karma balance"}</InlineDataLabel>
      <InlineDataContent
        sideContent={
          typeof karmaBalance === "bigint" && Number(karmaBalance) === 0 ? (
            <Button className="h-full [&_svg]:size-6" variant="flat" size="sm">
              {"Get 1"}
            </Button>
          ) : null
        }
      >
        {isSessionPending || isKarmaBalancePending ? (
          <LoaderCircle className="animate-spin size-6" />
        ) : (
          `${karmaBalance} krm`
        )}
      </InlineDataContent>
    </InlineData>
  );
};
