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
import { useAppWriteContract } from "@/lib/hooks/useAppWriteContract";
import { stringToBytes32 } from "@/lib/utils/stringToBytes32";
import { toast } from "@shared/ui/components/sonner";
import { ZERO_ADDRESS } from "@/lib/web3/constants";

const formSchema = z.object({
  newAddress: z
    .string()
    .startsWith("0x", "Address must begin with 0x")
    .length(42, "Address length must be of 42 symbols"),
});

export const AgencyWalletAddressForm = ({
  organizationId,
}: {
  organizationId: string;
}) => {
  const { address: connectedWalletAddress } = useAccount();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(formSchema),
    defaultValues: {
      newAddress: "",
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
    args: [stringToBytes32(organizationId)],
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
    args: [stringToBytes32(organizationId)],
  });

  useEffect(() => {
    if (
      currentSavedAddress &&
      currentSavedAddress !== ZERO_ADDRESS &&
      currentSavedAddress !== form.getValues("newAddress")
    ) {
      form.setValue("newAddress", currentSavedAddress as `0x${string}`);
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
        "An error occured during fetching whitelisted data from the blockchain."
      );
    }
  }, [isErrorWhitelisted]);

  useEffect(() => {
    if (isErrorCurrentSavedAddress) {
      toast(
        "An error occured during fetching current saved address from the blockchain."
      );
    }
  }, [isErrorCurrentSavedAddress]);

  useEffect(() => {
    if (typeof isWhitelisted === "boolean" && !isWhitelisted) {
      toast("Agency is not whitelisted in blockchain. Contact support!");
    }
  }, [isWhitelisted]);

  const onSubmit = async ({ newAddress }: z.infer<typeof formSchema>) => {
    form.clearErrors();
    writeContract({
      abi: systemContractAbi,
      address: getEnvConfigClient()
        .NEXT_PUBLIC_SYSTEM_CONTRACT_ADDRESS as `0x${string}`,
      functionName: "setAgencyAddress",
      args: [stringToBytes32(organizationId), newAddress as `0x${string}`],
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="newAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{"Set agency wallet address"}</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    disabled={
                      isPendingWhitelisted ||
                      isPendingCurrentSavedAddress ||
                      isProcessing ||
                      !isWhitelisted ||
                      currentSavedAddress !== connectedWalletAddress ||
                      currentSavedAddress === form.getValues("newAddress")
                    }
                    placeholder={
                      typeof isWhitelisted === "boolean" && !isWhitelisted
                        ? "Not whitelisted. Contact support!"
                        : "new address"
                    }
                    aria-invalid={!!form.formState.errors.newAddress}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                  />
                </FormControl>
                <div className="font-bold absolute right-0 top-0 bg-main/30 border-l h-full flex justify-center items-center p-2 font-mono text-sm border-border">
                  <Button
                    className="h-full"
                    type="submit"
                    variant="flat"
                    size="sm"
                    disabled={
                      !form.formState.isValid ||
                      !!Object.keys(form.formState.errors).length ||
                      isPendingWhitelisted ||
                      isPendingCurrentSavedAddress ||
                      isProcessing ||
                      !isWhitelisted ||
                      connectedWalletAddress !== currentSavedAddress ||
                      currentSavedAddress === form.getValues("newAddress")
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
                </div>
              </div>
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
