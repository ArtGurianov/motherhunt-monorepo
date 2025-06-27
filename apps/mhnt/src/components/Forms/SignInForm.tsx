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
import { useRef, useState } from "react";
import { FormStatus } from "./types";
import { LoaderCircle } from "lucide-react";
import { HCaptchaFormItem } from "@/components/HCaptchaFormItem/HCaptchaFormItem";
import { LangSwitcher } from "@/components/LangSwitcher/LangSwitcher";
import HCaptcha from "@hcaptcha/react-hcaptcha";

const formSchema = z.object({
  email: z.email(),
  hCaptchaToken: z.string().min(1, { message: "You must verify you're human" }),
});

export const SignInForm = () => {
  const [formStatus, setFormStatus] = useState<FormStatus>("PENDING");

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
    setFormStatus("LOADING");
    const result = await authClient.signIn.magicLink({
      email,
      callbackURL: "/",
      fetchOptions: {
        headers: {
          "x-captcha-response": hCaptchaToken,
        },
      },
    });
    setFormStatus(result.error ? "ERROR" : "SUCCESS");
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
                      disabled={formStatus === "LOADING"}
                      placeholder="type your email"
                      {...field}
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
            <div className="relative w-full flex justify-end items-center">
              <div className="absolute z-10 left-0 top-0">
                <LangSwitcher />
              </div>
              {formStatus === "SUCCESS" ? (
                <span className="text-xl">{"Email sent!"}</span>
              ) : (
                <Button
                  type="submit"
                  variant="secondary"
                  size="lg"
                  disabled={
                    formStatus === "LOADING" ||
                    !form.formState.isValid ||
                    !!Object.keys(form.formState.errors).length
                  }
                >
                  {formStatus === "LOADING" ? (
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
