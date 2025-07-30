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
import { useState } from "react";
import { SuccessBlock } from "./SuccessBlock";
import { LoaderCircle } from "lucide-react";
import { systemContractAbi } from "@/lib/web3/abi";
import { getEnvConfigClient } from "@/lib/config/env";
import { useAppWriteContract } from "@/lib/hooks/useAppWriteContract";

const formSchema = z.object({
  address: z
    .string()
    .startsWith("0x", "Address must begin with 0x")
    .length(42, "Address length must be of 42 symbols"),
});

interface AddSuperAdminFormProps {
  onRefetchSuperAdmins: () => void;
}

export const AddSuperAdminForm = ({
  onRefetchSuperAdmins,
}: AddSuperAdminFormProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
    },
  });

  const { writeContract, isProcessing } = useAppWriteContract({
    onSuccess: () => {
      form.reset();
      onRefetchSuperAdmins();
      setIsSubmitted(true);
    },
  });

  const onSubmit = async ({ address }: z.infer<typeof formSchema>) => {
    form.clearErrors();
    writeContract({
      abi: systemContractAbi,
      address: getEnvConfigClient()
        .NEXT_PUBLIC_SYSTEM_CONTRACT_ADDRESS as `0x${string}`,
      functionName: "addProjectSuperAdmin",
      args: [address as `0x${string}`],
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
              <FormLabel>{"New super admin address"}</FormLabel>
              <FormControl>
                <Input
                  disabled={isProcessing}
                  placeholder={"type address starts with 0x"}
                  aria-invalid={!!form.formState.errors.address}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    setIsSubmitted(false);
                  }}
                  sideContent={
                    <Button
                      className="h-full"
                      type="submit"
                      variant="flat"
                      size="sm"
                      disabled={
                        !!Object.keys(form.formState.errors).length ||
                        isProcessing
                      }
                    >
                      {isProcessing ? (
                        <LoaderCircle className="animate-spin h-6 w-6" />
                      ) : (
                        "Add"
                      )}
                    </Button>
                  }
                />
              </FormControl>
              <FormMessage />
              <SuccessBlock message={isSubmitted ? "success" : undefined} />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
