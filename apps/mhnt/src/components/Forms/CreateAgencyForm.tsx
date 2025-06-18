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
import { authClient } from "@/lib/authClient";

const formSchema = z.object({
  agencyName: z.string(),
  agencySlug: z.string(),
  headBookerName: z.string(),
  headBookerEmail: z.email(),
});

export const CreateAgencyForm = () => {
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
    await authClient.organization.create({
      name: agencyName,
      slug: agencySlug,
      metadata: {
        headBookerEmail,
        headBookerName,
      },
    });
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
                    <Input placeholder="enter name of the agency" {...field} />
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
            <Button variant="secondary" type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
