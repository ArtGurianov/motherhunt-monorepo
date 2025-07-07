"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
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
import { Input } from "@shared/ui/components/input";
import { authClient } from "@/lib/auth/authClient";
import { useState, useTransition } from "react";
import { FormStatus } from "./types";
import { LoaderCircle } from "lucide-react";
import { AppClientError } from "@shared/ui/lib/utils/appClientError";
import { ErrorBlock } from "./ErrorBlock";
import { SuccessBlock } from "./SuccessBlock";

interface ChangeEmailFormProps {
  currentEmail: string;
}

const formSchema = z.object({
  email: z.email(),
});

export const ChangeEmailForm = ({ currentEmail }: ChangeEmailFormProps) => {
  const [formStatus, setFormStatus] = useState<FormStatus>("PENDING");
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: currentEmail,
    },
  });

  const t = useTranslations("CHANGE_EMAIL");

  const onSubmit = async ({ email }: z.infer<typeof formSchema>) => {
    setErrorMessage(null);
    startTransition(async () => {
      try {
        if (!email) {
          throw new AppClientError("Email is required");
        }
        const result = await authClient.changeEmail({
          newEmail: email,
          callbackURL: "/?toast=UPDATED",
        });
        if (result?.error) {
          setErrorMessage(result.error.message || "Failed to change email");
          setFormStatus("ERROR");
          return;
        }
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("email-label")}</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    disabled={isPending || formStatus === "SUCCESS"}
                    placeholder={t("email-placeholder")}
                    aria-invalid={
                      !!form.formState.errors.email || !!errorMessage
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
                      isPending ||
                      formStatus === "SUCCESS" ||
                      form.getValues("email") === currentEmail
                    }
                  >
                    {isPending ? (
                      <LoaderCircle className="animate-spin h-6 w-6" />
                    ) : form.getValues("email") === currentEmail ? (
                      t("verified")
                    ) : (
                      t("verify")
                    )}
                  </Button>
                </div>
              </div>
              <FormMessage />
              <ErrorBlock message={errorMessage} />
              <SuccessBlock
                message={
                  formStatus === "SUCCESS" ? t("success-message") : undefined
                }
              />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
