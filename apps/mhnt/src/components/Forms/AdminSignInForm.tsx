"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormField } from "@shared/ui/components/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shared/ui/components/card";
import { authClient } from "@/lib/auth/authClient";
import { useEffect, useRef, useState, useTransition } from "react";
import { LoaderCircle } from "lucide-react";
import { HCaptchaFormItem } from "@/components/HCaptchaFormItem/HCaptchaFormItem";
import { LangSwitcher } from "@/components/LangSwitcher/LangSwitcher";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { ErrorBlock } from "./ErrorBlock";
import { useAppParams } from "@/lib/hooks";
import { useAccount, useSignMessage } from "wagmi";
import { useRouter } from "next/navigation";
import { hCaptchaSchema } from "@/lib/schemas/hCaptchaSchema";
import { Web3ConnectBtn } from "../ActionButtons/Web3ConnectBtn";
import { generateUpdatedPathString } from "@/lib/utils/generateUpdatedPathString";
import { APP_ROUTES, APP_ROUTES_CONFIG } from "@/lib/routes/routes";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { SESSION_QUERY_KEY } from "@/lib/hooks";

export const AdminSignInForm = () => {
  const t = useTranslations("ADMIN_SIGN_IN");
  const tCommon = useTranslations("COMMON.BUTTONS");
  const tErrors = useTranslations("ERRORS");
  const router = useRouter();
  const { getParam, deleteParam } = useAppParams();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const hCaptchaRef = useRef<HCaptcha>(null);

  const { address } = useAccount();

  const {
    data: signature,
    error: signatureError,
    isPending: isSignaturePending,
    signMessage,
    isIdle,
  } = useSignMessage();

  const onSubmit = () => {
    signMessage({ message: "sign-in" });
  };

  const form = useForm<z.infer<typeof hCaptchaSchema>>({
    mode: "all",
    resolver: zodResolver(hCaptchaSchema),
    defaultValues: {
      hCaptchaToken: "",
    },
  });

  useEffect(() => {
    if (signature && address) {
      startTransition(async () => {
        try {
          const result = await authClient.signIn.trustedUser({
            address,
            signature,
            fetchOptions: {
              headers: {
                "x-captcha-response": form.getValues("hCaptchaToken"),
              },
              onSuccess: () => {
                queryClient.invalidateQueries({
                  queryKey: [SESSION_QUERY_KEY],
                });
              },
            },
          });
          if (result.error) {
            setErrorMessage(result.error.message || result.error.statusText);
          } else {
            const returnTo = getParam("returnTo");
            if (returnTo) deleteParam("returnTo");
            router.push(
              generateUpdatedPathString(
                returnTo ?? APP_ROUTES_CONFIG[APP_ROUTES.AUCTION].href,
                new URLSearchParams({
                  toast: "SIGNED_IN",
                }),
              ),
            );
          }
        } catch (error) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : tErrors("something-went-wrong"),
          );
        }
      });
    }
  }, [signature, address]);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="hCaptchaToken"
              render={() => {
                return (
                  <HCaptchaFormItem
                    ref={hCaptchaRef}
                    onSuccess={(token) => {
                      form.setValue("hCaptchaToken", token, {
                        shouldValidate: true,
                      });
                    }}
                  />
                );
              }}
            />
            <ErrorBlock message={errorMessage || signatureError?.message} />
            <div className="relative w-full flex justify-end items-center">
              <div className="absolute z-10 left-0 top-0">
                <LangSwitcher />
              </div>
              <Web3ConnectBtn
                type="submit"
                variant="secondary"
                size="lg"
                disabled={
                  isPending ||
                  (isSignaturePending && !isIdle) ||
                  !form.formState.isValid ||
                  !!Object.keys(form.formState.errors).length
                }
              >
                {isPending || (isSignaturePending && !isIdle) ? (
                  <LoaderCircle className="py-1 animate-spin h-8 w-8" />
                ) : (
                  tCommon("sign-in")
                )}
              </Web3ConnectBtn>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
