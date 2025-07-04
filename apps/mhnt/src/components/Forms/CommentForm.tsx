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
import { Textarea } from "@shared/ui/components/textarea";
import { useState } from "react";
import { FormStatus } from "./types";
import { LoaderCircle } from "lucide-react";

const formSchema = z.object({
  value: z.string().min(20),
});

interface CommentFormProps {
  defaultValue?: string;
  placeholder?: string;
  onSubmit: (_: string) => Promise<void>;
}

export const CommentForm = ({
  defaultValue = "",
  placeholder = "Write down your comment",
  onSubmit,
}: CommentFormProps) => {
  const [formStatus, setFormStatus] = useState<FormStatus>("PENDING");

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: defaultValue,
    },
  });

  const handleSubmit = async ({ value }: z.infer<typeof formSchema>) => {
    setFormStatus("LOADING");

    try {
      await onSubmit(value);
      setFormStatus("SUCCESS");
    } catch {
      setFormStatus("ERROR");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4 h-full"
      >
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem className="grow flex flex-col">
              <FormLabel>{"Comment"}</FormLabel>
              <FormControl className="grow">
                <Textarea
                  className="h-full"
                  disabled={formStatus === "LOADING"}
                  placeholder={placeholder}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full flex justify-end items-center">
          {formStatus === "SUCCESS" ? (
            <span className="text-xl flex h-10 justify-center items-center">
              {"Success!"}
            </span>
          ) : (
            <Button
              type="submit"
              variant="secondary"
              disabled={
                !form.formState.isDirty ||
                formStatus === "LOADING" ||
                !!Object.keys(form.formState.errors).length
              }
            >
              {formStatus === "LOADING" ? (
                <LoaderCircle className="py-1 animate-spin h-8 w-8" />
              ) : (
                "Submit"
              )}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};
