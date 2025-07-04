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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@shared/ui/components/card";
import { Suspense, useState } from "react";
import { FormStatus } from "./types";
import { LoaderCircle } from "lucide-react";
import { InterceptedLink } from "../InterceptedLink/InterceptedLink";
import { authClient } from "@/lib/auth/authClient";

const formSchema = z.object({
  name: z.string().min(3),
  slug: z.string().min(3),
});

export const CreateAgencyForm = () => {
  const [formStatus, setFormStatus] = useState<FormStatus>("PENDING");

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const onSubmit = async ({ name, slug }: z.infer<typeof formSchema>) => {
    setFormStatus("LOADING");

    try {
      await authClient.organization.create({
        name,
        slug,
      });
      setFormStatus("SUCCESS");
    } catch {
      setFormStatus("ERROR");
    }
  };

  return (
    <Card className="w-full max-w-sm pb-0">
      <CardHeader>
        <CardTitle>{"New Agency Application"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Agency Name"}</FormLabel>
                  <FormControl>
                    <Input
                      disabled={formStatus === "LOADING"}
                      placeholder="Provide name of the agency"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Agency Slug"}</FormLabel>
                  <FormControl>
                    <Input
                      disabled={formStatus === "LOADING"}
                      placeholder="Enter unique slug of the agency"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {"Will be used as unique identidier"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full flex justify-end items-center">
              {formStatus === "SUCCESS" ? (
                <span className="text-xl flex h-10 justify-center items-center">
                  {"Submitted!"}
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
                    "Register"
                  )}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="border-t pt-2 pb-3 bg-accent-foreground/20">
        <Suspense>
          <Button asChild size="lg" type="submit" className="w-full">
            <InterceptedLink href="/settings/agency/requests">
              {"View my requests"}
            </InterceptedLink>
          </Button>
        </Suspense>
      </CardFooter>
    </Card>
  );
};
