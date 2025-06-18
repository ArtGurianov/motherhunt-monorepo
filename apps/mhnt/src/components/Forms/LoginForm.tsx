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
import { signIn } from "@/lib/authClient";
import { usePathname } from "next/navigation";

const formSchema = z.object({
  email: z.email(),
});

export const LoginForm = () => {
  const pathname = usePathname();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async ({ email }: z.infer<typeof formSchema>) => {
    await signIn.magicLink(
      {
        email,
        callbackURL: pathname,
      },
      {
        onRequest: () => {},
        onSuccess: () => {},
        onError: (e) => {
          console.log(e);
        },
      }
    );
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
                    <Input placeholder="type your email" {...field} />
                  </FormControl>
                  <FormDescription>{"Some description"}</FormDescription>
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
