"use client";

import { Lot } from "@shared/db";
import { useState, useCallback, useMemo } from "react";
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
import { useAuthenticated } from "@/lib/hooks";

interface DraftContentProps {
  draftData: Lot;
}

type AccordionState = "profile" | "confirmation" | "review" | "publish" | null;

export const DraftContent = ({ draftData }: DraftContentProps) => {
  const { session } = useAuthenticated();

  const [openedAccordion, setOpenedAccordion] =
    useState<AccordionState>("profile");

  const contractConfig = useMemo(
    () => ({
      abi: auctionContractAbi,
      address: getEnvConfigClient()
        .NEXT_PUBLIC_AUCTION_CONTRACT_ADDRESS as `0x${string}`,
      functionName: "getLotData" as const,
      query: {
        enabled: !!draftData.signedByUserId,
      },
    }),
    [draftData.signedByUserId],
  );

  const {
    data: lotChainData,
    // isPending: isPendingLotChainData,
    // isError: isErrorLotChainData,
  } = useReadContract(contractConfig);

  const isOnChain = useMemo(() => {
    const validationResult = lotChainSchema.safeParse(lotChainData);
    return (
      !!validationResult.data && validationResult.data.scouterId !== ZERO_BYTES
    );
  }, [lotChainData]);

  const handleProfileToggle = useCallback(() => {
    setOpenedAccordion((prev) => (prev === "profile" ? null : "profile"));
  }, []);

  const handleConfirmationToggle = useCallback(() => {
    setOpenedAccordion((prev) =>
      prev === "confirmation" ? null : "confirmation",
    );
  }, []);

  const handleReviewToggle = useCallback(() => {
    setOpenedAccordion((prev) => (prev === "review" ? null : "review"));
  }, []);

  const handlePublishToggle = useCallback(() => {
    setOpenedAccordion((prev) => (prev === "publish" ? null : "publish"));
  }, []);

  if (draftData.scouterId !== session.userId) {
    return (
      <StatusCard type={StatusCardTypes.ERROR} title="Not a lot creator!" />
    );
  }

  return (
    <>
      <LotProfile
        isOnChain={isOnChain}
        lotData={draftData}
        isOpen={openedAccordion === "profile"}
        onToggle={handleProfileToggle}
      />
      <LotConfirmationEmail
        isOnChain={isOnChain}
        lotData={draftData}
        isOpen={openedAccordion === "confirmation"}
        onToggle={handleConfirmationToggle}
      />
      <LotReview
        lotData={draftData}
        isOpen={openedAccordion === "review"}
        onToggle={handleReviewToggle}
      />
      <LotPublish
        lotData={draftData}
        isOpen={openedAccordion === "publish"}
        onToggle={handlePublishToggle}
      />
    </>
  );
};
