"use client";

import { InfoCardAccordion } from "@/components/InfoCard/InfoCardAccordion";
import { Lot } from "@shared/db";

interface LotPublishProps {
  lotData: Lot;
  isOpen: boolean;
  onToggle: () => void;
}

export const LotPublish = ({ isOpen, onToggle }: LotPublishProps) => {
  return (
    <InfoCardAccordion
      isOpen={isOpen}
      onToggle={onToggle}
      title={"auction listing"}
    >
      {"publish to auction or cancel"}
    </InfoCardAccordion>
  );
};
