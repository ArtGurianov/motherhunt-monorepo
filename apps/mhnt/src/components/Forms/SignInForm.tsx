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
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { FormStatus } from "./types";
import { LoaderCircle } from "lucide-react";
import { useTurnstile } from "@/lib/hooks";
import Script from "next/script";
import { TurnStileFormItem } from "../TurnstileFormItem/TurnstileFormItem";

const formSchema = z.object({
  email: z.email(),
  turnstileToken: z
    .string()
    .min(1, { message: "You must verify you're human" }),
});

export const SignInForm = () => {
  const pathname = usePathname();
  const [formStatus, setFormStatus] = useState<FormStatus>("PENDING");

  const turnstileRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      turnstileToken: "",
    },
  });

  const { buildTurnstile } = useTurnstile(turnstileRef, (token: string) =>
    form.setValue("turnstileToken", token)
  );

  const onSubmit = async ({
    email,
    turnstileToken,
  }: z.infer<typeof formSchema>) => {
    setFormStatus("LOADING");
    const result = await authClient.signIn.magicLink({
      email,
      callbackURL: pathname,
      fetchOptions: {
        headers: {
          "x-captcha-response": turnstileToken,
        },
      },
    });
    setFormStatus(result.error ? "ERROR" : "SUCCESS");
  };

  return (
    <Card className="w-full max-w-sm">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
        onReady={() => {
          buildTurnstile();
        }}
      />
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
              name="turnstileToken"
              render={() => {
                return <TurnStileFormItem ref={turnstileRef} />;
              }}
            />
            <div className="w-full flex justify-end items-center">
              {formStatus === "SUCCESS" ? (
                <span className="text-xl">{"Email sent!"}</span>
              ) : (
                <Button
                  type="submit"
                  variant="secondary"
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
