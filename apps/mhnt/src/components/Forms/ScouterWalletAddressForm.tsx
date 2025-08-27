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
import { useAppWriteContract } from "@/lib/hooks";
import { stringToBytes32 } from "@/lib/web3/stringToBytes32";
import { toast } from "@shared/ui/components/sonner";
import { ZERO_ADDRESS } from "@/lib/web3/constants";
import { addressSchema } from "@/lib/schemas/addressSchema";
import { useAuth } from "../AppProviders/AuthProvider";

export const ScouterWalletAddressForm = () => {
  const { session } = useAuth();

  const { address: connectedWalletAddress } = useAccount();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof addressSchema>>({
    mode: "onChange",
    resolver: zodResolver(addressSchema),
    defaultValues: {
      address: "",
    },
  });

  const {
    data: currentSavedAddress,
    isPending: isPendingCurrentSavedAddress,
    isError: isErrorCurrentSavedAddress,
    refetch: refetchCurrentSavedAddress,
  } = useReadContract({
    abi: systemContractAbi,
    address: getEnvConfigClient()
      .NEXT_PUBLIC_SYSTEM_CONTRACT_ADDRESS as `0x${string}`,
    functionName: "getScouterAddress",
    args: [stringToBytes32(session.userId ?? "")],
    query: {
      enabled: !!session.userId,
    },
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
      refetchCurrentSavedAddress();
    },
  });

  useEffect(() => {
    if (isErrorCurrentSavedAddress) {
      toast(
        "An error occured during fetching current saved address from the blockchain."
      );
    }
  }, [isErrorCurrentSavedAddress]);

  const onSubmit = async ({ address }: z.infer<typeof addressSchema>) => {
    form.clearErrors();
    writeContract({
      abi: systemContractAbi,
      address: getEnvConfigClient()
        .NEXT_PUBLIC_SYSTEM_CONTRACT_ADDRESS as `0x${string}`,
      functionName: "setScouterAddress",
      args: [stringToBytes32(session.userId), address as `0x${string}`],
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{"Scouter wallet address"}</FormLabel>
              <FormControl>
                <Input
                  disabled={isPendingCurrentSavedAddress || isProcessing}
                  placeholder="new address"
                  aria-invalid={!!form.formState.errors.address}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                  }}
                  sideContent={
                    <Button
                      className="h-full [&_svg]:size-6"
                      type="submit"
                      variant="flat"
                      size="sm"
                      disabled={
                        !form.formState.isValid ||
                        !!Object.keys(form.formState.errors).length ||
                        isPendingCurrentSavedAddress ||
                        isProcessing ||
                        (currentSavedAddress !== ZERO_ADDRESS &&
                          currentSavedAddress !== connectedWalletAddress) ||
                        currentSavedAddress === form.getValues("address")
                      }
                    >
                      {isPendingCurrentSavedAddress || isProcessing ? (
                        <LoaderCircle className="animate-spin" />
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
