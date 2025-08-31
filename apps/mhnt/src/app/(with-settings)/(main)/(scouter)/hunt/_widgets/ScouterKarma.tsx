"use client";

import { CrownStrikeSvgUrl, CrownSvgUrl } from "@/components/Svg";
import { getEnvConfigClient } from "@/lib/config/env";
import { auctionContractAbi, karmaContractAbi } from "@/lib/web3/abi";
import { stringToBytes32 } from "@/lib/web3/stringToBytes32";
import { Button } from "@shared/ui/components/button";
import {
  InlineData,
  InlineDataContent,
  InlineDataLabel,
} from "@shared/ui/components/InlineData";
import { TooltipPopover } from "@shared/ui/components/TooltipPopover";
import { cn, getSiteURL } from "@shared/ui/lib/utils";
import { LoaderCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useReadContract } from "wagmi";
import { TopUpDialog } from "./TopUpDialog";
import { useAuth } from "@/components/AppProviders/AuthProvider";

export const ScouterKarma = () => {
  const { session } = useAuth();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: minVotableKarma } = useReadContract({
    abi: auctionContractAbi,
    address: getEnvConfigClient()
      .NEXT_PUBLIC_AUCTION_CONTRACT_ADDRESS as `0x${string}`,
    functionName: "MIN_VOTABLE_AMOUNT_KARMA",
  });

  const {
    data: karmaBalance,
    isPending: isKarmaBalancePending,
    refetch: refetchKarmaBalance,
  } = useReadContract({
    abi: karmaContractAbi,
    address: getEnvConfigClient()
      .NEXT_PUBLIC_KARMA_CONTRACT_ADDRESS as `0x${string}`,
    functionName: "balanceOf",
    args: [stringToBytes32(session.userId ?? "")],
    query: {
      enabled: !!session.userId,
    },
  });

  return (
    <>
      <InlineData>
        <InlineDataLabel>{"Karma balance"}</InlineDataLabel>
        <InlineDataContent
          sideContent={
            typeof karmaBalance === "bigint" && Number(karmaBalance) === 0 ? (
              <Button
                className="h-full [&_svg]:size-6"
                variant="flat"
                size="sm"
                onClick={() => {
                  setIsDialogOpen(true);
                }}
              >
                {"Top up"}
              </Button>
            ) : null
          }
        >
          {isKarmaBalancePending ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <span className="flex gap-2 items-center justify-between">
              <span className="flex gap-2 items-center">
                {`${karmaBalance} krm`}
                <TooltipPopover
                  content={`After earning ${typeof minVotableKarma === "number" ? minVotableKarma : "a certain amount of"} karma, you become eligible to vote and rate models, as well as spend your karma on commission discounts.`}
                >
                  <Image
                    src={
                      Number(karmaBalance) >= Number(minVotableKarma)
                        ? CrownSvgUrl
                        : CrownStrikeSvgUrl
                    }
                    alt="crown"
                    width="0"
                    height="0"
                    sizes="100vh"
                    className={cn("size-6", {
                      "opacity-70":
                        Number(karmaBalance) < Number(minVotableKarma),
                    })}
                    priority
                  />
                </TooltipPopover>
              </span>
              <Button
                asChild
                variant="link"
                className="font-mono text-sm p-0 px-1 h-6"
              >
                <Link
                  href={`${getSiteURL()}/guides/karma`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {"learn"}
                </Link>
              </Button>
            </span>
          )}
        </InlineDataContent>
      </InlineData>
      <TopUpDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
        }}
        onSuccess={() => {
          setIsDialogOpen(false);
          refetchKarmaBalance();
        }}
      />
    </>
  );
};
