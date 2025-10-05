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
import { Input } from "@shared/ui/components/input";
import { authClient } from "@/lib/auth/authClient";
import { useState, useTransition } from "react";
import { FormStatus } from "./types";
import { LoaderCircle } from "lucide-react";
import { ErrorBlock } from "./ErrorBlock";
import { SuccessBlock } from "./SuccessBlock";
import { useAppParams } from "@/lib/hooks";
import { emailSchema } from "@/lib/schemas/emailSchema";
import { TOAST_PARAM_URL_TOKEN } from "@/lib/hooks/useToastParam";
import { APP_ROUTES, APP_ROUTES_CONFIG } from "@/lib/routes/routes";

interface ChangeEmailFormProps {
  currentEmail: string;
}

export const ChangeEmailForm = ({ currentEmail }: ChangeEmailFormProps) => {
  const { setParam, getUpdatedParamsString } = useAppParams();
  const [formStatus, setFormStatus] = useState<FormStatus>("PENDING");
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof emailSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: currentEmail,
    },
  });

  const t = useTranslations("CHANGE_EMAIL");

  const onSubmit = async ({ email }: z.infer<typeof emailSchema>) => {
    setErrorMessage(null);
    startTransition(async () => {
      try {
        setParam(TOAST_PARAM_URL_TOKEN, "UPDATED");
        const result = await authClient.changeEmail({
          newEmail: email,
          callbackURL: `${APP_ROUTES_CONFIG[APP_ROUTES.AUCTION].href}${getUpdatedParamsString()}`,
        });
        if (result?.error) {
          setErrorMessage(result.error.message || "Failed to change email");
          setFormStatus("ERROR");
          return;
        }
        setFormStatus("SUCCESS");
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Something went wrong."
        );
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
              <FormControl>
                <Input
                  disabled={isPending || formStatus === "SUCCESS"}
                  placeholder={t("email-placeholder")}
                  aria-invalid={!!form.formState.errors.email || !!errorMessage}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    setFormStatus("PENDING");
                    setErrorMessage(null);
                  }}
                  sideContent={
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
                  }
                />
              </FormControl>
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
