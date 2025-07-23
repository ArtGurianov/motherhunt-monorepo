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
import { authClient } from "@/lib/auth/authClient";
import { useState, useTransition } from "react";
import { FormStatus } from "./types";
import { AppClientError } from "@shared/ui/lib/utils/appClientError";
import { ErrorBlock } from "./ErrorBlock";
import { SuccessBlock } from "./SuccessBlock";
import { AGENCY_ROLES } from "@/lib/auth/permissions/agency-permissions";
import { LoaderCircle } from "lucide-react";

const formSchema = z.object({
  email: z.string().email(),
});

export const BookerInvitationForm = () => {
  const [formStatus, setFormStatus] = useState<FormStatus>("PENDING");
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async ({ email }: z.infer<typeof formSchema>) => {
    setErrorMessage(null);
    startTransition(async () => {
      try {
        if (!email) {
          throw new AppClientError("Email is required");
        }
        const result = await authClient.organization.inviteMember({
          email,
          role: AGENCY_ROLES.BOOKER_ROLE,
        });
        if (result?.error) {
          setErrorMessage(result.error.message || "Failed to send invitation");
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
              <FormLabel>{"Invite new booker"}</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    disabled={isPending || formStatus === "SUCCESS"}
                    placeholder={"user email"}
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
                      formStatus === "SUCCESS"
                    }
                  >
                    {isPending ? (
                      <LoaderCircle className="animate-spin h-6 w-6" />
                    ) : (
                      "Invite"
                    )}
                  </Button>
                </div>
              </div>
              <FormMessage />
              <ErrorBlock message={errorMessage} />
              <SuccessBlock
                message={formStatus === "SUCCESS" ? "success" : undefined}
              />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
