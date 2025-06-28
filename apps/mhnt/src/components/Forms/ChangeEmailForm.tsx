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
                  />
                </FormControl>
                <div className="absolute z-10 right-0 top-0 h-full p-1">
                  {formStatus === "SUCCESS" ? (
                    <span className="text-md flex h-full justify-center items-center">
                      {"Email sent!"}
                    </span>
                  ) : (
                    <Button
                      className="h-full bg-main px-3 text-lg rounded-md hover:bg-background"
                      type="submit"
                      variant="ghost"
                      size="reset"
                      disabled={
                        formStatus === "LOADING" ||
                        !form.formState.isValid ||
                        !!Object.keys(form.formState.errors).length ||
                        form.getValues("email") === currentEmail
                      }
                    >
                      {formStatus === "LOADING" ? (
                        <LoaderCircle className="animate-spin h-8 w-8" />
                      ) : (
                        "Verify"
                      )}
                    </Button>
                  )}
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
