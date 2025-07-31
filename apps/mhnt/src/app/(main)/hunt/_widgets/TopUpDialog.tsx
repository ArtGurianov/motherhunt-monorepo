"use client";

import { ApproveTxBtn } from "@/components/ActionButtons/ApproveTxBtn";
import { TopUpKarmaBtn } from "@/components/ActionButtons/TopUpKarmaBtn";
import { getEnvConfigClient } from "@/lib/config/env";
import { feesTokenDetailsSchema } from "@/lib/schemas/feesTokenDetailsSchema";
import {
  karmaContractAbi,
  systemContractAbi,
  usdContractAbi,
} from "@/lib/web3/abi";
import { Button } from "@shared/ui/components/button";
import { DialogDrawer } from "@shared/ui/components/DialogDrawer/DialogDrawer";
import { Quote } from "@shared/ui/components/Quote";
import { getSiteURL } from "@shared/ui/lib/utils";
import Link from "next/link";
import { formatUnits } from "viem";
import { useAccount, useReadContract } from "wagmi";

interface TopUpDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const TopUpDialog = ({
  isOpen,
  onClose,
  onSuccess,
}: TopUpDialogProps) => {
  const envConfigClient = getEnvConfigClient();
  const { address } = useAccount();

  const {
    data: feesContractDetails,
    isPending: isFeesContractDetailsLoading,
    isError: isFeesContractDetailsError,
  } = useReadContract({
    abi: systemContractAbi,
    address:
      envConfigClient.NEXT_PUBLIC_SYSTEM_CONTRACT_ADDRESS as `0x${string}`,
    functionName: "getFeesTokenDetails",
  });

  const validationResult =
    feesTokenDetailsSchema.safeParse(feesContractDetails);

  const {
    data: balanceUsd,
    isLoading: isBalanceLoading,
    isError: isBalanceError,
    refetch: refetchBalance,
  } = useReadContract({
    abi: usdContractAbi,
    address: validationResult.data?.tokenAddress as `0x${string}`,
    functionName: "balanceOf",
    args: [address!],
    query: { enabled: validationResult.success && !!address },
  });

  const {
    data: karmaPriceUsd,
    isPending: isKarmaPriceUsdLoading,
    isError: isKarmaPriceUsdError,
  } = useReadContract({
    abi: karmaContractAbi,
    address:
      envConfigClient.NEXT_PUBLIC_KARMA_CONTRACT_ADDRESS as `0x${string}`,
    functionName: "KARMA_PRICE_USD",
  });

  const {
    data: allowance,
    isLoading: isAllowanceLoading,
    isError: isAllowanceError,
    refetch: refetchAllowance,
  } = useReadContract({
    abi: usdContractAbi,
    address: validationResult.data?.tokenAddress as `0x${string}`,
    functionName: "allowance",
    args: [
      address!,
      envConfigClient.NEXT_PUBLIC_KARMA_CONTRACT_ADDRESS as `0x${string}`,
    ],
    query: { enabled: validationResult.success && !!address },
  });

  const isLoadingDisplayBalance =
    isFeesContractDetailsLoading || isBalanceLoading;
  const isErrorDisplayBalance = isFeesContractDetailsError || isBalanceError;
  let displayBalance = "loading...";
  if (validationResult.success && typeof balanceUsd === "bigint") {
    displayBalance = `${formatUnits(
      balanceUsd,
      validationResult.data.decimals
    )} ${validationResult.data.symbol}`;
  }
  if (isLoadingDisplayBalance) {
    displayBalance = "loading...";
  }
  if (isErrorDisplayBalance) {
    displayBalance = "blockchain fetch error";
  }

  return (
    <DialogDrawer
      title={"Top up Karma"}
      isOpen={isOpen}
      onClose={onClose}
      className="h-auto px-4"
    >
      <Quote>
        {
          "Karma is designed to be earned by voting and successful placements, hence you can only purchase 1 KRM only if having zero balance."
        }
        <Button
          asChild
          variant="link"
          className="font-mono text-sm p-0 px-1 h-6 ml-2"
        >
          <Link
            href={`${getSiteURL()}/guides/karma`}
            rel="noopener noreferrer"
            target="_blank"
          >
            {"learn more"}
          </Link>
        </Button>
      </Quote>
      <span className="flex text-2xl justify-center items-center mt-4">{`Wallet balance: ${displayBalance}`}</span>
      <div className="flex flex-col gap-4 px-6 py-4 justify-center items-center">
        <span className="text-lg text-center">
          {`1 KRM price: ${karmaPriceUsd} USD`}
        </span>
        <div className="flex gap-4">
          <ApproveTxBtn
            isLoading={isAllowanceLoading || isKarmaPriceUsdLoading}
            isError={isAllowanceError || isKarmaPriceUsdError || isBalanceError}
            currentAllowanceUsd={
              typeof allowance === "bigint" && validationResult.success
                ? Number(formatUnits(allowance, validationResult.data.decimals))
                : undefined
            }
            currentBalanceUsd={
              typeof balanceUsd === "bigint" && validationResult.success
                ? Number(
                    formatUnits(balanceUsd, validationResult.data.decimals)
                  )
                : undefined
            }
            priceUsd={
              typeof karmaPriceUsd === "bigint"
                ? Number(karmaPriceUsd)
                : undefined
            }
            usdContractAddress={
              validationResult.success
                ? (validationResult.data.tokenAddress as `0x${string}`)
                : undefined
            }
            spenderContractAddress={
              envConfigClient.NEXT_PUBLIC_KARMA_CONTRACT_ADDRESS as `0x${string}`
            }
            decimals={
              validationResult.success
                ? validationResult.data.decimals
                : undefined
            }
            onSuccess={() => {
              refetchAllowance();
            }}
          >
            {"Approve"}
          </ApproveTxBtn>
          <TopUpKarmaBtn
            isLoading={isAllowanceLoading || isKarmaPriceUsdLoading}
            isError={isAllowanceError || isKarmaPriceUsdError || isBalanceError}
            currentAllowanceUsd={
              typeof allowance === "bigint" && validationResult.success
                ? Number(formatUnits(allowance, validationResult.data.decimals))
                : undefined
            }
            currentBalanceUsd={
              typeof balanceUsd === "bigint" && validationResult.success
                ? Number(
                    formatUnits(balanceUsd, validationResult.data.decimals)
                  )
                : undefined
            }
            priceUsd={
              typeof karmaPriceUsd === "bigint"
                ? Number(karmaPriceUsd)
                : undefined
            }
            spenderContractAddress={
              envConfigClient.NEXT_PUBLIC_KARMA_CONTRACT_ADDRESS as `0x${string}`
            }
            onSuccess={() => {
              refetchAllowance();
              refetchBalance();
              onSuccess();
            }}
          >
            {"Purchase"}
          </TopUpKarmaBtn>
        </div>
      </div>
    </DialogDrawer>
  );
};
