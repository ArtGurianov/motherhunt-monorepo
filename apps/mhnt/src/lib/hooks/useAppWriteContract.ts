import { toast } from "@shared/ui/components/sonner";
import { useEffect } from "react";
import { TransactionReceipt } from "viem";
import { useTransactionReceipt, useWriteContract } from "wagmi";

export const useAppWriteContract = (props?: {
  onSuccess?: (_: TransactionReceipt) => void;
  onError?: (e: unknown) => void;
  onRevert?: (_: TransactionReceipt) => void;
}) => {
  const {
    writeContract,
    data: hash,
    error: txError,
    isPending: isTxPending,
  } = useWriteContract();

  useEffect(() => {
    if (hash) {
      toast(`Transaction is sent! Tx hash: ${hash}`);
    }
  }, [hash]);

  const {
    error: receiptError,
    isFetching: isReceiptFetching,
    data: receipt,
  } = useTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (txError) {
      props?.onError?.(txError);
      toast("An error occured while sending a transaction to the blockchain!");
    }
  }, [txError]);

  useEffect(() => {
    if (receiptError) {
      props?.onError?.(receiptError);
      toast(
        "An error occured while executing a transaction on the blockchain!"
      );
    }
  }, [receiptError]);

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
    isError: !!receiptError || !!txError,
  };
};
