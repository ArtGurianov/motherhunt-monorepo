"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTranslations } from "next-intl";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@shared/ui/components/form";
import { Textarea } from "@shared/ui/components/textarea";
import { useState, useTransition } from "react";
import { FormStatus } from "./types";
import { LoaderCircle } from "lucide-react";
import { ErrorBlock } from "./ErrorBlock";
import { SuccessBlock } from "./SuccessBlock";
import { commentSchema } from "@/lib/schemas/commentSchema";
import { Web3ConnectBtn } from "../ActionButtons/Web3ConnectBtn";

interface CommentFormProps {
  defaultValue?: string;
  onSubmit: (_: string) => void;
}

export const CommentForm = ({
  defaultValue = "",
  onSubmit,
}: CommentFormProps) => {
  const [formStatus, setFormStatus] = useState<FormStatus>("PENDING");
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const t = useTranslations("COMMENT");

  const form = useForm<z.infer<typeof commentSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(commentSchema),
    defaultValues: {
      value: defaultValue,
    },
  });

  const handleSubmit = async ({ value }: z.infer<typeof commentSchema>) => {
    setErrorMessage(null);
    startTransition(async () => {
      try {
        onSubmit(value);
        setFormStatus("SUCCESS");
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Something went wrong.",
        );
        setFormStatus("ERROR");
      }
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4 h-full"
      >
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem className="grow flex flex-col">
              <FormLabel>{t("label")}</FormLabel>
              <FormControl className="grow">
                <Textarea
                  className="h-full"
                  disabled={isPending || formStatus === "SUCCESS"}
                  placeholder={t("placeholder")}
                  aria-invalid={!!form.formState.errors.value || !!errorMessage}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    setFormStatus("PENDING");
                    setErrorMessage(null);
                  }}
                />
              </FormControl>
              <FormMessage />
              <ErrorBlock message={errorMessage} />
            </FormItem>
          )}
        />
        <div className="w-full flex justify-end items-center">
          <Web3ConnectBtn
            type="submit"
            variant="secondary"
            disabled={
              !form.formState.isDirty ||
              isPending ||
              !!Object.keys(form.formState.errors).length ||
              formStatus === "SUCCESS"
            }
          >
            {isPending ? (
              <LoaderCircle className="py-1 animate-spin h-8 w-8" />
            ) : (
              t("submit")
            )}
          </Web3ConnectBtn>
        </div>
        <SuccessBlock
          message={formStatus === "SUCCESS" ? t("success-message") : undefined}
        />
      </form>
    </Form>
  );
};
