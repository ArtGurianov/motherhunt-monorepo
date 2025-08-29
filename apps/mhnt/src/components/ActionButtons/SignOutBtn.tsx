"use client";

import { authClient } from "@/lib/auth/authClient";
import { Button } from "@shared/ui/components/button";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { generateUpdatedPathString } from "@/lib/utils/generateUpdatedPathString";
import { APP_ROUTES, APP_ROUTES_CONFIG } from "@/lib/routes/routes";

const REDIRECT_PATH_SIGNED_OUT = generateUpdatedPathString(
  APP_ROUTES_CONFIG[APP_ROUTES.SIGN_IN].href,
  new URLSearchParams({
    toast: "SIGNED_OUT",
  })
);

export const SignOutBtn = () => {
  const router = useRouter();

  const t = useTranslations("ACTION_BUTTONS");

  return (
    <Button
      onClick={() =>
        authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push(REDIRECT_PATH_SIGNED_OUT);
            },
          },
        })
      }
      className="flex gap-1 text-lg font-light font-mono float-end"
    >
      {t("sign-out")}
    </Button>
  );
};
