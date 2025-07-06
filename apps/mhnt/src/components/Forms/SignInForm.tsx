"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";

import { Button } from "@shared/ui/components/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { FormStatus } from "./types";
import { LoaderCircle } from "lucide-react";
import { HCaptchaFormItem } from "@/components/HCaptchaFormItem/HCaptchaFormItem";
import { LangSwitcher } from "@/components/LangSwitcher/LangSwitcher";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { AppClientError } from "@shared/ui/lib/utils/appClientError";
import { ErrorBlock } from "./ErrorBlock";
import { SuccessBlock } from "./SuccessBlock";

const formSchema = z.object({
  email: z.email(),
  hCaptchaToken: z.string().min(1, { message: "You must verify you're human" }),
});

export const SignInForm = () => {
  const [formStatus, setFormStatus] = useState<FormStatus>("PENDING");
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const hCaptchaRef = useRef<HCaptcha>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      hCaptchaToken: "",
    },
  });

  const onSubmit = async ({
    email,
    hCaptchaToken,
  }: z.infer<typeof formSchema>) => {
    setErrorMessage(null);
    startTransition(async () => {
      try {
        if (!email) {
          throw new AppClientError("Email is required");
        }
        if (!hCaptchaToken) {
          throw new AppClientError("You must verify you're human");
        }
        const result = await authClient.signIn.magicLink({
          email,
          callbackURL: "/?toast=SIGNED_IN",
          fetchOptions: {
            headers: {
              "x-captcha-response": hCaptchaToken,
            },
          },
        });
        if (result?.error) {
          setErrorMessage(result.error.message || "Failed to sign in");
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
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending || formStatus === "SUCCESS"}
                      placeholder="type your email"
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
                  <FormDescription>{"Some description"}</FormDescription>
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
                    onSuccess={(token) => form.setValue("hCaptchaToken", token)}
                  />
                );
              }}
            />
            <ErrorBlock message={errorMessage} />
            <SuccessBlock
              message={
                formStatus === "SUCCESS"
                  ? "Email sent! Please check your inbox."
                  : undefined
              }
            />
            <div className="relative w-full flex justify-end items-center">
              <div className="absolute z-10 left-0 top-0">
                <LangSwitcher />
              </div>
              {formStatus === "SUCCESS" ? (
                <span className="text-xl flex h-10 justify-center items-center">
                  {"Email sent!"}
                </span>
              ) : (
                <Button
                  type="submit"
                  variant="secondary"
                  size="lg"
                  disabled={
                    isPending ||
                    !form.formState.isValid ||
                    !!Object.keys(form.formState.errors).length
                  }
                >
                  {isPending ? (
                    <LoaderCircle className="py-1 animate-spin h-8 w-8" />
                  ) : (
                    "Send link"
                  )}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
