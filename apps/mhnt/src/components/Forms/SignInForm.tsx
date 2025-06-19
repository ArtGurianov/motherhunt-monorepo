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
import { useState } from "react";
import { FormStatus } from "./types";
import { LoaderCircle } from "lucide-react";

const formSchema = z.object({
  email: z.email(),
});

interface SignInFormProps {
  turnstileToken: string;
  userIp: string;
}

export const SignInForm = ({ turnstileToken, userIp }: SignInFormProps) => {
  const pathname = usePathname();
  const [formStatus, setFormStatus] = useState<FormStatus>("PENDING");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async ({ email }: z.infer<typeof formSchema>) => {
    setFormStatus("LOADING");
    const result = await authClient.signIn.magicLink(
      {
        email,
        callbackURL: pathname,
        fetchOptions: {
          headers: {
            "x-captcha-response": turnstileToken,
            "x-captcha-user-remote-ip": userIp,
          },
        },
      },
      {
        // onRequest: () => {},
        // onSuccess: () => {},
        // onError: (e) => {
        //   console.log(e);
        // },
      }
    );

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
            {formStatus === "SUCCESS" ? (
              <span className="text-xl">{"Email sent!"}</span>
            ) : (
              <Button
                type="submit"
                variant="secondary"
                disabled={
                  formStatus === "LOADING" ||
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
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
