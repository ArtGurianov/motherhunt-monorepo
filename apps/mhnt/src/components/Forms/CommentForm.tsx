"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTranslations } from "next-intl";

import { Button } from "@shared/ui/components/button";
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
import { AppClientError } from "@shared/ui/lib/utils/appClientError";
import { ErrorBlock } from "./ErrorBlock";
import { SuccessBlock } from "./SuccessBlock";

const formSchema = z.object({
  value: z.string().min(20),
});

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

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: defaultValue,
    },
  });

  const handleSubmit = async ({ value }: z.infer<typeof formSchema>) => {
    setErrorMessage(null);
    startTransition(async () => {
      try {
        if (!value || value.length < 20) {
          throw new AppClientError("Comment must be at least 20 characters");
        }
        onSubmit(value);
        setFormStatus("SUCCESS");
      } catch (error) {
        if (error instanceof AppClientError) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("An unexpected error occurred. Please try again.");
        }
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
          <Button
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
          </Button>
        </div>
        <SuccessBlock
          message={formStatus === "SUCCESS" ? t("success-message") : undefined}
        />
      </form>
    </Form>
  );
};
