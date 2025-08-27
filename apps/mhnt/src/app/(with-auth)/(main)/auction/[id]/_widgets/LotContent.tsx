"use client";

import { Lot } from "@shared/db";
import { useState } from "react";
import { LotProfile } from "./LotProfile";
import { LotConfirmationEmail } from "./LotConfirmationEmail";
import { LotReview } from "./LotReview";
import { LotPublish } from "./LotPublish";
import { useReadContract } from "wagmi";
import { auctionContractAbi } from "@/lib/web3/abi";
import { getEnvConfigClient } from "@/lib/config/env";
import { lotChainSchema } from "@/lib/schemas/lotChainSchema";
import { ZERO_BYTES } from "@/lib/web3/constants";
import { StatusCard, StatusCardTypes } from "@shared/ui/components/StatusCard";
import { useAuth } from "@/components/AppProviders/AuthProvider";

interface LotContentProps {
  lotData: Lot;
}

export const LotContent = ({ lotData }: LotContentProps) => {
  const { session } = useAuth();

  const [openedAccordion, setOpenedAccordion] = useState<
    "profile" | "confirmation" | "review" | "publish" | null
  >("profile");

  const {
    data: lotChainData,
    // isPending: isPendingLotChainData,
    // isError: isErrorLotChainData,
  } = useReadContract({
    abi: auctionContractAbi,
    address: getEnvConfigClient()
      .NEXT_PUBLIC_AUCTION_CONTRACT_ADDRESS as `0x${string}`,
    functionName: "getLotData",
    query: {
      enabled: !!lotData.signedByUserId,
    },
  });

  const validationResult = lotChainSchema.safeParse(lotChainData);
  const isOnChain =
    !!validationResult.data && validationResult.data.scouterId !== ZERO_BYTES;

  if (lotData.scouterId !== session.userId)
    return (
      <StatusCard type={StatusCardTypes.ERROR} title="Not a lot creator!" />
    );

  return (
    <>
      <LotProfile
        isOnChain={isOnChain}
        lotData={lotData}
        isOpen={openedAccordion === "profile"}
        onToggle={() => {
          setOpenedAccordion((prev) => (prev === "profile" ? null : "profile"));
        }}
      />
      <LotConfirmationEmail
        isOnChain={isOnChain}
        lotData={lotData}
        isOpen={openedAccordion === "confirmation"}
        onToggle={() => {
          setOpenedAccordion((prev) =>
            prev === "confirmation" ? null : "confirmation"
          );
        }}
      />
      <LotReview
        lotData={lotData}
        isOpen={openedAccordion === "review"}
        onToggle={() => {
          setOpenedAccordion((prev) => (prev === "review" ? null : "review"));
        }}
      />
      <LotPublish
        lotData={lotData}
        isOpen={openedAccordion === "publish"}
        onToggle={() => {
          setOpenedAccordion((prev) => (prev === "publish" ? null : "publish"));
        }}
      />
    </>
  );
};
