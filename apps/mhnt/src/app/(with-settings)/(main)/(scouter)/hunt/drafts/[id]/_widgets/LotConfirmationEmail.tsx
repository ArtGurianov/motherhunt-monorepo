"use client";

import { calcelLotConfirmation } from "@/actions/cancelLotConfirmation";
import { sendLotConfirmation } from "@/actions/sendLotConfirmation";
import { DangerousActionDialog } from "@/components/DangerousActionDialog/DangerousActionDialog";
import { ErrorBlock } from "@/components/Forms";
import { InfoCardAccordion } from "@/components/InfoCard/InfoCardAccordion";
import { validLotDraftSchema } from "@/lib/schemas/validLotDraftSchema";
import { Lot } from "@shared/db";
import { Button } from "@shared/ui/components/button";
import {
  InlineData,
  InlineDataContent,
  InlineDataLabel,
} from "@shared/ui/components/InlineData";
import { Quote } from "@shared/ui/components/Quote";
import { LoaderCircle } from "lucide-react";
import { useState, useTransition } from "react";

interface ModelConfirmationProps {
  isOnChain: boolean;
  lotData: Lot;
  isOpen: boolean;
  onToggle: () => void;
}

export const LotConfirmationEmail = ({
  isOnChain,
  lotData,
  isOpen,
  onToggle,
}: ModelConfirmationProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const draftValidationResult = validLotDraftSchema.safeParse(lotData);

  const onConfirmationEmailSend = () => {
    startTransition(async () => {
      try {
        const result = await sendLotConfirmation({
          lotId: lotData.id,
        });
        if (!result.success) {
          setErrorMessage(result.errorMessage);
          return;
        }
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Something went wrong.",
        );
      }
    });
  };

  const onConfirmationEmailCancel = () => {
    startTransition(async () => {
      try {
        const result = await calcelLotConfirmation({
          lotId: lotData.id,
        });
        if (!result.success) {
          setErrorMessage(result.errorMessage || "Failed cancel confirmation");
          return;
        }
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Something went wrong.",
        );
      }
    });
  };

  return (
    <InfoCardAccordion
      title="model confirmation"
      isOpen={isOpen}
      onToggle={onToggle}
    >
      {lotData.isConfirmationEmailSent && !lotData.signedByUserId ? (
        <Quote>{"Email is sent. Waiting for confirmation."}</Quote>
      ) : null}
      {lotData.isConfirmationEmailSent && !!lotData.signedByUserId ? (
        <Quote>{"Lot data is confirmed by model."}</Quote>
      ) : null}
      <InlineData>
        <InlineDataLabel>{"email"}</InlineDataLabel>
        <InlineDataContent
          disabled={
            lotData.isConfirmationEmailSent ||
            !!lotData.signedByUserId ||
            isOnChain
          }
        >
          {lotData.email ?? "Email is not set."}
        </InlineDataContent>
      </InlineData>
      <ErrorBlock message={errorMessage} />
      <div className="flex gap-2 justify-end items-center">
        <Button
          onClick={onConfirmationEmailSend}
          disabled={
            lotData.isConfirmationEmailSent ||
            !!lotData.signedByUserId ||
            !draftValidationResult.success ||
            isPending ||
            isOnChain
          }
        >
          {isPending ? (
            <LoaderCircle className="animate-spin h-6 w-6" />
          ) : (
            "Send email"
          )}
        </Button>
        <Button
          onClick={() => {
            setIsDialogOpen(true);
          }}
          disabled={!lotData.isConfirmationEmailSent || isPending || isOnChain}
        >
          {isPending ? (
            <LoaderCircle className="animate-spin h-6 w-6" />
          ) : (
            "Back to editing"
          )}
        </Button>
      </div>
      <DangerousActionDialog
        title={"Cancel current confirmation?"}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onActionConfirm={onConfirmationEmailCancel}
      />
    </InfoCardAccordion>
  );
};
