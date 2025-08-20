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
import { AppClientError } from "@shared/ui/lib/utils/appClientError";
import { ErrorBlock } from "./ErrorBlock";
import { useAppParams } from "@/lib/hooks/useAppParams";
import { useAccount, useSignMessage } from "wagmi";
import { useRouter } from "next/navigation";
import { toast } from "@shared/ui/components/sonner";
import { hCaptchaSchema } from "@/lib/schemas/hCaptchaSchema";
import { WithWeb3ConnectBtn } from "../ActionButtons/WithWeb3ConnectBtn";

export const AdminSignInForm = () => {
  const router = useRouter();
  const { getParam, setParam, deleteParam } = useAppParams();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
          setParam("toast", "SIGNED_IN");
          const returnTo = getParam("returnTo");
          if (returnTo) deleteParam("returnTo");
          const result = await authClient.signIn.trustedUser({
            address,
            signature,
            fetchOptions: {
              headers: {
                "x-captcha-response": form.getValues("hCaptchaToken"),
              },
            },
          });
          if (result.error) {
            setErrorMessage(result.error.message || result.error.statusText);
          } else {
            toast("Success");
            router.push("/");
          }
        } catch (error) {
          if (error instanceof AppClientError) {
            setErrorMessage(error.message);
          } else {
            setErrorMessage("Unexpected error occurred. Please try again.");
          }
        }
      });
    }
  }, [signature, address]);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{"Admin login"}</CardTitle>
        <CardDescription>{"Sign in using your web3 wallet"}</CardDescription>
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
              <WithWeb3ConnectBtn
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
                  "Sign in"
                )}
              </WithWeb3ConnectBtn>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
