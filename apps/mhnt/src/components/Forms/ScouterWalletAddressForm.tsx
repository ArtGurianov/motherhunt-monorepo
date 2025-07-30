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
import { stringToBytes32 } from "@/lib/web3/stringToBytes32";
import { toast } from "@shared/ui/components/sonner";
import { ZERO_ADDRESS } from "@/lib/web3/constants";
import { authClient } from "@/lib/auth/authClient";

const formSchema = z.object({
  newAddress: z
    .string()
    .startsWith("0x", "Address must begin with 0x")
    .length(42, "Address length must be of 42 symbols"),
});

export const ScouterWalletAddressForm = () => {
  const { isPending: isSessionPending, data: sessionData } =
    authClient.useSession();

  const { address: connectedWalletAddress } = useAccount();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      newAddress: "",
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
    args: [stringToBytes32(sessionData?.session.userId ?? "")],
    query: {
      enabled: !!sessionData?.session.userId && !isSessionPending,
    },
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

  const onSubmit = async ({ newAddress }: z.infer<typeof formSchema>) => {
    if (sessionData) {
      form.clearErrors();
      writeContract({
        abi: systemContractAbi,
        address: getEnvConfigClient()
          .NEXT_PUBLIC_SYSTEM_CONTRACT_ADDRESS as `0x${string}`,
        functionName: "setScouterAddress",
        args: [
          stringToBytes32(sessionData.session.userId),
          newAddress as `0x${string}`,
        ],
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="newAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{"Scouter wallet address"}</FormLabel>
              <FormControl>
                <Input
                  disabled={
                    isSessionPending ||
                    isPendingCurrentSavedAddress ||
                    isProcessing
                  }
                  placeholder="new address"
                  aria-invalid={!!form.formState.errors.newAddress}
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
                        isSessionPending ||
                        !form.formState.isValid ||
                        !!Object.keys(form.formState.errors).length ||
                        isPendingCurrentSavedAddress ||
                        isProcessing ||
                        (currentSavedAddress !== ZERO_ADDRESS &&
                          currentSavedAddress !== connectedWalletAddress) ||
                        currentSavedAddress === form.getValues("newAddress")
                      }
                    >
                      {isSessionPending ||
                      isPendingCurrentSavedAddress ||
                      isProcessing ? (
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
