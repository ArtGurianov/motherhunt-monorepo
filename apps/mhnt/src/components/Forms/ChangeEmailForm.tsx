"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";

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
import { useState } from "react";
import { FormStatus } from "./types";
import { LoaderCircle } from "lucide-react";

interface ChangeEmailFormProps {
  currentEmail: string;
}

const formSchema = z.object({
  email: z.email(),
});

export const ChangeEmailForm = ({ currentEmail }: ChangeEmailFormProps) => {
  const [formStatus, setFormStatus] = useState<FormStatus>("PENDING");

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: currentEmail,
    },
  });

  const onSubmit = async ({ email }: z.infer<typeof formSchema>) => {
    setFormStatus("LOADING");
    const result = await authClient.changeEmail({
      newEmail: email,
      callbackURL: "/?toast=UPDATED",
    });
    setFormStatus(result.error ? "ERROR" : "SUCCESS");
  };

  let displayAction = (
    <Button
      className="h-full"
      type="submit"
      variant="flat"
      size="sm"
      disabled={
        !form.formState.isValid || !!Object.keys(form.formState.errors).length
      }
    >
      {"Verify"}
    </Button>
  );
  if (form.getValues("email") === currentEmail) {
    displayAction = <span className="text-green-500">{"Verified"}</span>;
  } else if (formStatus === "SUCCESS") {
    displayAction = <span>{"Email sent"}</span>;
  } else if (formStatus === "LOADING") {
    displayAction = (
      <span className="px-4">
        <LoaderCircle className="animate-spin h-6 w-6" />
      </span>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{"Email"}</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    disabled={formStatus === "LOADING"}
                    placeholder="type your new email"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setFormStatus("PENDING");
                    }}
                  />
                </FormControl>
                <div className="font-bold absolute right-0 top-0 bg-main/30 border-l h-full flex justify-center items-center p-2 font-mono text-sm border-border">
                  {displayAction}
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
