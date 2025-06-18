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
import { useState } from "react";
import { FormStatus } from "./types";
import { LoaderCircle } from "lucide-react";

const formSchema = z.object({
  agencyName: z.string(),
  agencySlug: z.string(),
  headBookerName: z.string(),
  headBookerEmail: z.email(),
});

export const CreateAgencyForm = () => {
  const [formStatus, setFormStatus] = useState<FormStatus>("PENDING");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      agencyName: "",
      agencySlug: "",
      headBookerName: "",
      headBookerEmail: "",
    },
  });

  const onSubmit = async ({
    agencyName,
    agencySlug,
    headBookerEmail,
    headBookerName,
  }: z.infer<typeof formSchema>) => {
    setFormStatus("LOADING");

    const result = await authClient.organization.create({
      name: agencyName,
      slug: agencySlug,
      metadata: {
        headBookerEmail,
        headBookerName,
      },
    });

    setFormStatus(result.error ? "ERROR" : "SUCCESS");
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Create Agency Organization</CardTitle>
        <CardDescription>New agency</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="agencyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agency Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={formStatus === "LOADING"}
                      placeholder="enter name of the agency"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {"Some description for the agency"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="agencySlug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agency Slug</FormLabel>
                  <FormControl>
                    <Input
                      disabled={formStatus === "LOADING"}
                      placeholder="enter unique slug of the agency"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {"Some description for the slug"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="headBookerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Head Booker Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={formStatus === "LOADING"}
                      placeholder="enter name of agency head booker"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {"Some description for the head booker"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="headBookerEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Head Booker Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={formStatus === "LOADING"}
                      placeholder="enter email of agency head booker"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {"Some description for the head booker"}
                  </FormDescription>
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
                  "Create Organization"
                )}
              </Button>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
