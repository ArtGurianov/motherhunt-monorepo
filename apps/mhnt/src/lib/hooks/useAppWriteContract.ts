import { toast } from "@shared/ui/components/sonner";
import { useEffect } from "react";
import { useTransactionReceipt, useWriteContract } from "wagmi";

export const useAppWriteContract = ({
  onSuccess,
}: {
  onSuccess: () => void;
}) => {
  const {
    writeContract,
    data: hash,
    isError: isTxError,
    isPending: isTxPending,
  } = useWriteContract();

  useEffect(() => {
    if (hash) {
      toast(`Transaction is sent! Tx hash: ${hash}`);
    }
  }, [hash]);

  const {
    isError: isReceiptError,
    isFetching: isReceiptFetching,
    data: receiptData,
  } = useTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isTxError) {
      toast("An error occured while sending a transaction to the blockchain!");
    }
  }, [isTxError]);

  useEffect(() => {
    if (isReceiptError) {
      toast(
        "An error occured while executing a transaction on the blockchain!"
      );
    }
  }, [isTxError, isReceiptError]);

  useEffect(() => {
    if (receiptData?.status === "success") {
      onSuccess();
      toast("Transaction success!");
    }
    if (receiptData?.status === "reverted") {
      toast("Transaction reverted!");
    }
  }, [receiptData]);

  return { writeContract, isProcessing: isTxPending || isReceiptFetching };
};
