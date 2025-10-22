"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@shared/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@shared/ui/components/form";
import { Input } from "@shared/ui/components/input";
import { useEffect, useState } from "react";
import { SuccessBlock } from "./SuccessBlock";
import { LoaderCircle } from "lucide-react";
import { useAccount, useReadContract } from "wagmi";
import { systemContractAbi } from "@/lib/web3/abi";
import { getEnvConfigClient } from "@/lib/config/env";
import { useAppWriteContract, useAuthenticated } from "@/lib/hooks";
import { stringToBytes32 } from "@/lib/web3/stringToBytes32";
import { toast } from "@shared/ui/components/sonner";
import { ZERO_ADDRESS } from "@/lib/web3/constants";
import { addressSchema } from "@/lib/schemas/addressSchema";

export const AgencyWalletAddressForm = () => {
  const { session } = useAuthenticated();

  const { address: connectedWalletAddress } = useAccount();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof addressSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(addressSchema),
    defaultValues: {
      address: "",
    },
  });

  const {
    data: isWhitelisted,
    isPending: isPendingWhitelisted,
    isError: isErrorWhitelisted,
  } = useReadContract({
    abi: systemContractAbi,
    address: getEnvConfigClient()
      .NEXT_PUBLIC_SYSTEM_CONTRACT_ADDRESS as `0x${string}`,
    functionName: "isWhitelistedAgency",
    args: session.activeOrganizationId
      ? [stringToBytes32(session.activeOrganizationId)]
      : undefined,
    query: { enabled: !!session.activeOrganizationId },
  });

  const {
    data: currentSavedAddress,
    isPending: isPendingCurrentSavedAddress,
    isError: isErrorCurrentSavedAddress,
  } = useReadContract({
    abi: systemContractAbi,
    address: getEnvConfigClient()
      .NEXT_PUBLIC_SYSTEM_CONTRACT_ADDRESS as `0x${string}`,
    functionName: "getAgencyAddress",
    args: session.activeOrganizationId
      ? [stringToBytes32(session.activeOrganizationId)]
      : undefined,
    query: { enabled: !!session.activeOrganizationId },
  });

  useEffect(() => {
    if (
      currentSavedAddress &&
      currentSavedAddress !== ZERO_ADDRESS &&
      currentSavedAddress !== form.getValues("address")
    ) {
      form.setValue("address", currentSavedAddress as `0x${string}`);
    }
  }, [currentSavedAddress]);

  const { writeContract, isProcessing } = useAppWriteContract({
    onSuccess: () => {
      setIsSubmitted(true);
    },
  });

  useEffect(() => {
    if (isErrorWhitelisted) {
      toast(
        "An error occured during fetching whitelisted data from the blockchain.",
      );
    }
  }, [isErrorWhitelisted]);

  useEffect(() => {
    if (isErrorCurrentSavedAddress) {
      toast(
        "An error occured during fetching current saved address from the blockchain.",
      );
    }
  }, [isErrorCurrentSavedAddress]);

  useEffect(() => {
    if (typeof isWhitelisted === "boolean" && !isWhitelisted) {
      toast("Agency is not whitelisted in blockchain. Contact support!");
    }
  }, [isWhitelisted]);

  const onSubmit = async ({ address }: z.infer<typeof addressSchema>) => {
    if (session.activeOrganizationId) {
      form.clearErrors();
      writeContract({
        abi: systemContractAbi,
        address: getEnvConfigClient()
          .NEXT_PUBLIC_SYSTEM_CONTRACT_ADDRESS as `0x${string}`,
        functionName: "setAgencyAddress",
        args: [
          stringToBytes32(session.activeOrganizationId),
          address as `0x${string}`,
        ],
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{"Set agency wallet address"}</FormLabel>
              <FormControl>
                <Input
                  disabled={
                    isPendingWhitelisted ||
                    isPendingCurrentSavedAddress ||
                    isProcessing ||
                    !isWhitelisted ||
                    currentSavedAddress !== connectedWalletAddress ||
                    currentSavedAddress === form.getValues("address")
                  }
                  placeholder={
                    typeof isWhitelisted === "boolean" && !isWhitelisted
                      ? "Not whitelisted. Contact support!"
                      : "new address"
                  }
                  aria-invalid={!!form.formState.errors.address}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                  }}
                  sideContent={
                    <Button
                      className="h-full"
                      type="submit"
                      variant="flat"
                      size="sm"
                      disabled={
                        !session ||
                        !form.formState.isValid ||
                        !!Object.keys(form.formState.errors).length ||
                        isPendingWhitelisted ||
                        isPendingCurrentSavedAddress ||
                        isProcessing ||
                        !isWhitelisted ||
                        connectedWalletAddress !== currentSavedAddress ||
                        currentSavedAddress === form.getValues("address")
                      }
                    >
                      {isPendingWhitelisted ||
                      isPendingCurrentSavedAddress ||
                      isProcessing ? (
                        <LoaderCircle className="animate-spin h-6 w-6" />
                      ) : (
                        "Set"
                      )}
                    </Button>
                  }
                />
              </FormControl>
              <FormMessage />
              <SuccessBlock
                message={isSubmitted ? "Address changed!" : undefined}
              />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
