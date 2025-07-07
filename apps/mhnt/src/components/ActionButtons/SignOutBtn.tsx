"use client";

import { authClient } from "@/lib/auth/authClient";
import { Button } from "@shared/ui/components/button";
import { redirect } from "next/navigation";
import { useTranslations } from "next-intl";

export const SignOutBtn = () => {
  const t = useTranslations("ACTION_BUTTONS");

  return (
    <Button
      onClick={() =>
        authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              redirect("/signin?toast=SIGNED_OUT"); // redirect to signin page
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
