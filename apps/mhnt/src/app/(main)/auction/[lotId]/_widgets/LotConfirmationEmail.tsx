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
import { AppClientError } from "@shared/ui/lib/utils/appClientError";
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
        if (!lotData.email) {
          throw new AppClientError("Email is required");
        }
        const result = await sendLotConfirmation({
          lotId: lotData.id,
        });
        if (result.errorMessage) {
          setErrorMessage(result.errorMessage || "Failed to send email");
          return;
        }
      } catch (error) {
        if (error instanceof AppClientError) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("An unexpected error occurred. Please try again.");
        }
      }
    });
  };

  const onConfirmationEmailCancel = () => {
    startTransition(async () => {
      try {
        const result = await calcelLotConfirmation({
          lotId: lotData.id,
        });
        if (result.errorMessage) {
          setErrorMessage(result.errorMessage || "Failed cancel confirmation");
          return;
        }
      } catch (error) {
        if (error instanceof AppClientError) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("An unexpected error occurred. Please try again.");
        }
      }
    });
  };

  return (
    <InfoCardAccordion
      title="model confirmation"
      isOpen={isOpen}
      onToggle={onToggle}
    >
      {lotData.isConfirmationEmailSent && !lotData.isConfirmationSigned ? (
        <Quote>{"Email is sent. Waiting for confirmation."}</Quote>
      ) : null}
      {lotData.isConfirmationEmailSent && lotData.isConfirmationSigned ? (
        <Quote>{"Lot data is confirmed by model."}</Quote>
      ) : null}
      <InlineData>
        <InlineDataLabel>{"email"}</InlineDataLabel>
        <InlineDataContent
          disabled={
            lotData.isConfirmationEmailSent ||
            lotData.isConfirmationSigned ||
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
            lotData.isConfirmationSigned ||
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
