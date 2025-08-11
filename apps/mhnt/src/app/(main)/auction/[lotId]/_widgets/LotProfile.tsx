"use client";

import { LotForm } from "@/components/Forms/LotForm";
import { InfoCardAccordion } from "@/components/InfoCard/InfoCardAccordion";
import { Lot } from "@shared/db";

interface LotProfileProps {
  isOnChain: boolean;
  lotData: Lot;
  isOpen: boolean;
  onToggle: () => void;
}

export const LotProfile = ({
  isOnChain,
  lotData,
  isOpen,
  onToggle,
}: LotProfileProps) => {
  return (
    <InfoCardAccordion
      isOpen={isOpen}
      onToggle={onToggle}
      title={"model profile"}
    >
      <LotForm lotData={lotData} isOnChain={isOnChain} />
      {/* TODO:
          - editable if email isn't sent
          - locked if email sent
          - unlock to continue editing by canceling email */}
    </InfoCardAccordion>
  );
};
