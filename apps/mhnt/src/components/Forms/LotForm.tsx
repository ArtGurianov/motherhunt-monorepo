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
import { useState, useTransition } from "react";
import { LoaderCircle } from "lucide-react";
import { ErrorBlock } from "./ErrorBlock";
import { toast } from "@shared/ui/components/sonner";
import { updateDraft } from "@/actions/updateDraft";
import { Lot } from "@shared/db";
import { lotDraftSchema } from "@/lib/schemas/lotDraftSchema";

interface LotFormProps {
  isOnChain: boolean;
  lotData: Lot;
}

export const LotForm = ({ lotData, isOnChain }: LotFormProps) => {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof lotDraftSchema>>({
    disabled: isPending || lotData.isConfirmationEmailSent || isOnChain,
    mode: "onSubmit",
    resolver: zodResolver(lotDraftSchema),
    defaultValues: {
      name: lotData.name ?? "",
      email: lotData.email ?? "",
    },
  });

  const onSubmit = async (updateData: z.infer<typeof lotDraftSchema>) => {
    setErrorMessage(null);
    startTransition(async () => {
      const result = await updateDraft({
        lotId: lotData.id,
        updateData: {
          ...updateData,
        },
      });
      if (!result.success) {
        toast(result.errorMessage);
      } else {
        toast("Success");
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="name">{"name"}</FormLabel>
              <FormControl>
                <Input
                  id="name"
                  aria-invalid={!!form.formState.errors.name}
                  placeholder="Input model name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{"email"}</FormLabel>
              <FormControl>
                <Input
                  placeholder={"input email"}
                  aria-invalid={!!form.formState.errors.email || !!errorMessage}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    setErrorMessage(null);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ErrorBlock message={errorMessage} />
        <div className="w-full flex justify-end items-center">
          <Button
            type="submit"
            variant="secondary"
            disabled={
              !form.formState.isDirty ||
              isPending ||
              !!Object.keys(form.formState.errors).length ||
              isOnChain
            }
          >
            {isPending ? (
              <LoaderCircle className="py-1 animate-spin h-8 w-8" />
            ) : (
              "Save draft"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
