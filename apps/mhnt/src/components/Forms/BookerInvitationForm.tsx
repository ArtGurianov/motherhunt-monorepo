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
import { ErrorBlock } from "./ErrorBlock";
import { SuccessBlock } from "./SuccessBlock";
import { ORG_ROLES } from "@/lib/auth/permissions/org-permissions";
import { LoaderCircle } from "lucide-react";
import { emailSchema } from "@/lib/schemas/emailSchema";

export const BookerInvitationForm = () => {
  const [formStatus, setFormStatus] = useState<FormStatus>("PENDING");
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof emailSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async ({ email }: z.infer<typeof emailSchema>) => {
    setErrorMessage(null);
    startTransition(async () => {
      try {
        const result = await authClient.organization.inviteMember({
          email,
          role: ORG_ROLES.MEMBER_ROLE,
        });
        if (result?.error) {
          setErrorMessage(result.error.message || "Failed to send invitation");
          setFormStatus("ERROR");
          return;
        }
        setFormStatus("SUCCESS");
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Something went wrong.",
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
              <FormLabel>{"Invite new booker"}</FormLabel>
              <FormControl>
                <Input
                  disabled={isPending || formStatus === "SUCCESS"}
                  placeholder={"user email"}
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
                        formStatus === "SUCCESS"
                      }
                    >
                      {isPending ? (
                        <LoaderCircle className="animate-spin h-6 w-6" />
                      ) : (
                        "Invite"
                      )}
                    </Button>
                  }
                />
              </FormControl>
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
