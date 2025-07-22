"use client";

import { useTransactionReceipt, useWriteContract } from "wagmi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";

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
import { FormStatus } from "./types";
import { AppClientError } from "@shared/ui/lib/utils/appClientError";
import { ErrorBlock } from "./ErrorBlock";
import { SuccessBlock } from "./SuccessBlock";
import { LoaderCircle } from "lucide-react";
import { toast } from "@shared/ui/components/sonner";
import { systemContractAbi } from "@/lib/web3/abi";
import { getEnvConfigClient } from "@/lib/config/env";

const formSchema = z.object({
  address: z.string().startsWith("0x"),
});

interface AddSuperAdminFormProps {
  onRefetchSuperAdmins: () => void;
}

export const AddSuperAdminForm = ({
  onRefetchSuperAdmins,
}: AddSuperAdminFormProps) => {
  const [formStatus, setFormStatus] = useState<FormStatus>("PENDING");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
    },
  });

  const {
    writeContract,
    data: hash,
    isError: isTxError,
    isPending: isTxPending,
  } = useWriteContract();

  useEffect(() => {
    if (hash) {
      toast("Transaction is sent!");
    }
  }, [hash]);

  const {
    isSuccess,
    isError: isReceiptError,
    isFetching: isFetchingReceipt,
  } = useTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isSuccess) {
      setFormStatus("SUCCESS");
      onRefetchSuperAdmins();
      toast("Added super admin!");
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isTxError || isReceiptError) {
      setFormStatus("ERROR");
      toast("An error occured while sending a transaction!");
    }
  }, [isTxError, isReceiptError]);

  const onSubmit = async ({ address }: z.infer<typeof formSchema>) => {
    setErrorMessage(null);
    try {
      if (!address) {
        throw new AppClientError("Address is required");
      }
      writeContract({
        abi: systemContractAbi,
        address: getEnvConfigClient()
          .NEXT_PUBLIC_SYSTEM_CONTRACT_ADDRESS as `0x${string}`,
        functionName: "addProjectSuperAdmin",
        args: [address as `0x${string}`],
      });
    } catch {
      setErrorMessage("A blockchain error occurred. Please try again.");
      setFormStatus("ERROR");
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
              <FormLabel>{"New super admin address"}</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    disabled={
                      isFetchingReceipt ||
                      isTxPending ||
                      formStatus === "SUCCESS"
                    }
                    placeholder={"type address starts with 0x"}
                    aria-invalid={
                      !!form.formState.errors.address || !!errorMessage
                    }
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setFormStatus("PENDING");
                      setErrorMessage(null);
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
                      isFetchingReceipt ||
                      isTxPending ||
                      formStatus === "SUCCESS"
                    }
                  >
                    {isFetchingReceipt || isTxPending ? (
                      <LoaderCircle className="animate-spin h-6 w-6" />
                    ) : (
                      "Add"
                    )}
                  </Button>
                </div>
              </div>
              <FormMessage />
              <ErrorBlock message={errorMessage} />
              <SuccessBlock
                message={formStatus === "SUCCESS" ? "success" : undefined}
              />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
