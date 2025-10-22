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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shared/ui/components/card";
import { authClient } from "@/lib/auth/authClient";
import { useRef, useState, useTransition } from "react";
import { LoaderCircle } from "lucide-react";
import { HCaptchaFormItem } from "@/components/HCaptchaFormItem/HCaptchaFormItem";
import { LangSwitcher } from "@/components/LangSwitcher/LangSwitcher";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { ErrorBlock } from "./ErrorBlock";
import { SuccessBlock } from "./SuccessBlock";
import { useTranslations } from "next-intl";
import { useAppParams } from "@/lib/hooks/useAppParams";
import { magicLinkFormSchema } from "@/lib/schemas/magicLinkFormSchema";
import { TOAST_PARAM_URL_TOKEN } from "@/lib/hooks/useToastParam";
import { APP_ROUTES, APP_ROUTES_CONFIG } from "@/lib/routes/routes";

export const SignInForm = () => {
  const { getParam, setParam, deleteParam, getUpdatedParamsString } =
    useAppParams();
  const [isPending, startTransition] = useTransition();
  const [isSent, setIsSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const hCaptchaRef = useRef<HCaptcha>(null);
  const t = useTranslations("SIGN_IN");
  const tErrors = useTranslations("ERRORS");

  const form = useForm<z.infer<typeof magicLinkFormSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(magicLinkFormSchema),
    defaultValues: {
      email: "",
      hCaptchaToken: "",
    },
  });

  const onSubmit = async ({
    email,
    hCaptchaToken,
  }: z.infer<typeof magicLinkFormSchema>) => {
    startTransition(async () => {
      setErrorMessage(null);
      setIsSent(false);
      try {
        setParam(TOAST_PARAM_URL_TOKEN, "SIGNED_IN");
        const returnTo = getParam("returnTo");
        if (returnTo) deleteParam("returnTo");

        const result = await authClient.signIn.magicLink({
          email,
          callbackURL: `${returnTo ?? APP_ROUTES_CONFIG[APP_ROUTES.AUCTION].href}${getUpdatedParamsString()}`,
          fetchOptions: {
            headers: {
              "x-captcha-response": hCaptchaToken,
            },
          },
        });
        if (result?.error) {
          throw new Error(tErrors("magic-link-failed"));
        }
        setIsSent(true);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : tErrors("something-went-wrong"),
        );
      }
    });
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
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
                      {...field}
                      disabled={isPending}
                      placeholder={t("email-placeholder")}
                      aria-invalid={!!form.formState.errors.email}
                      onChange={(e) => {
                        field.onChange(e);
                        setIsSent(false);
                        setErrorMessage(null);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hCaptchaToken"
              render={() => {
                return (
                  <HCaptchaFormItem
                    ref={hCaptchaRef}
                    onSuccess={(token) => {
                      form.setValue("hCaptchaToken", token, {
                        shouldValidate: true,
                      });
                    }}
                  />
                );
              }}
            />
            <ErrorBlock message={errorMessage} />
            <div className="relative w-full flex justify-end items-center">
              <div className="absolute z-10 left-0 top-0">
                <LangSwitcher />
              </div>
              <Button
                type="submit"
                variant="secondary"
                size="lg"
                disabled={
                  isPending ||
                  !!errorMessage ||
                  isSent ||
                  !form.formState.isValid ||
                  !!Object.keys(form.formState.errors).length
                }
              >
                {isPending ? (
                  <LoaderCircle className="py-1 animate-spin h-8 w-8" />
                ) : (
                  t("send-link")
                )}
              </Button>
            </div>
            <SuccessBlock message={isSent ? t("success-message") : undefined} />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
