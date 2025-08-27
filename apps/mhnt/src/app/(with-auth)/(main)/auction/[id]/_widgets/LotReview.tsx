"use client";

import { InfoCardAccordion } from "@/components/InfoCard/InfoCardAccordion";
import { Lot } from "@shared/db";

interface LotReviewProps {
  lotData: Lot;
  isOpen: boolean;
  onToggle: () => void;
}

export const LotReview = ({ isOpen, onToggle }: LotReviewProps) => {
  return (
    <InfoCardAccordion
      isOpen={isOpen}
      onToggle={onToggle}
      title={"community review"}
    >
      {/* TODO: */}
      {/* Once submitted onchain, onChain status automatically gets updated in the db */}
      {/* but if error happened while saving from callback, we need to provide autochecks */}
      {/* 1. Autochecks on login with timeout */}
      {/* 1. Autochecks from settings */}
      {"submit to onchain review voting"}
    </InfoCardAccordion>
  );
};
