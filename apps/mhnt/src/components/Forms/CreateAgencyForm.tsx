"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTranslations } from "next-intl";

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
import { Suspense, useState, useTransition } from "react";
import { LoaderCircle } from "lucide-react";
import { InterceptedLink } from "../InterceptedLink/InterceptedLink";
import { ErrorBlock } from "./ErrorBlock";
import { SuccessBlock } from "./SuccessBlock";
import { createOrganization } from "@/actions/createOrganization";
import { toast } from "@shared/ui/components/sonner";

const transformStringToSlug = (value: string) =>
  value
    .trim()
    .replace(/[^a-zA-Z0-9 ]+/g, "")
    .replace(/([^ A-Z])([A-Z])/g, "$1-$2")
    .toLowerCase()
    .replace(/ +/g, "-")
    .replace(/^-+|-+$/g, "");

const formSchema = z.object({
  name: z.string().min(3),
  slug: z.string().min(3),
});

export const CreateAgencyForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const t = useTranslations("CREATE_AGENCY");

  const onSubmit = async ({ name, slug }: z.infer<typeof formSchema>) => {
    setErrorMessage(null);
    startTransition(async () => {
      const result = await createOrganization({ name, slug });
      if (result.errorMessage) {
        toast(result.errorMessage);
      } else {
        setIsSubmitted(true);
        form.reset();
      }
    });
  };

  return (
    <Card className="w-full max-w-sm pb-0">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="agency-name">{t("name-label")}</FormLabel>
                  <FormControl>
                    <Input
                      id="agency-name"
                      aria-invalid={!!form.formState.errors.name}
                      disabled={isPending || isSubmitted}
                      placeholder={t("name-placeholder")}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        form.setValue(
                          "slug",
                          transformStringToSlug(e.target.value)
                        );
                        setErrorMessage(null);
                      }}
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
                  <FormLabel htmlFor="agency-slug">{t("slug-label")}</FormLabel>
                  <FormControl>
                    <Input
                      id="agency-slug"
                      aria-invalid={!!form.formState.errors.slug}
                      disabled
                      placeholder={t("slug-placeholder")}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setErrorMessage(null);
                      }}
                    />
                  </FormControl>
                  <FormDescription>{t("slug-description")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <ErrorBlock message={errorMessage} />
            <div className="w-full flex justify-end items-center">
              <Button
                type="submit"
                variant="secondary"
                disabled={
                  !form.formState.isDirty ||
                  isPending ||
                  !!Object.keys(form.formState.errors).length ||
                  isSubmitted
                }
              >
                {isPending ? (
                  <LoaderCircle className="py-1 animate-spin h-8 w-8" />
                ) : (
                  t("register")
                )}
              </Button>
            </div>
            <SuccessBlock
              message={isSubmitted ? t("success-message") : undefined}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="border-t pt-2 pb-3 bg-accent-foreground/20">
        <Suspense>
          <Button asChild size="lg" type="submit" className="w-full">
            <InterceptedLink href="/settings/agency/requests">
              {t("view-requests")}
            </InterceptedLink>
          </Button>
        </Suspense>
      </CardFooter>
    </Card>
  );
};
