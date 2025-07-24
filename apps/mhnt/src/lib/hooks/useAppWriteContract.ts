import { toast } from "@shared/ui/components/sonner";
import { useEffect } from "react";
import { TransactionReceipt } from "viem";
import { useTransactionReceipt, useWriteContract } from "wagmi";

export const useAppWriteContract = (props?: {
  onSuccess?: (_: TransactionReceipt) => void;
  onRevert?: (_: TransactionReceipt) => void;
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
    data: receipt,
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
    if (receipt?.status === "success") {
      props?.onSuccess?.(receipt);
      toast("Transaction success!");
    }
    if (receipt?.status === "reverted") {
      toast("Transaction reverted!");
      props?.onRevert?.(receipt);
    }
  }, [receipt]);

  return {
    writeContract,
    isProcessing: isTxPending || isReceiptFetching,
    hash,
    receipt,
  };
};
