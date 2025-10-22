"use client";

import { Button } from "@shared/ui/components/button";
import { useTranslations } from "next-intl";
import { useSignOut } from "@/lib/hooks/useSignOut";

export const SignOutBtn = () => {
  const t = useTranslations("ACTION_BUTTONS");
  const { signOut, isPending } = useSignOut();

  return (
    <Button
      onClick={signOut}
      disabled={isPending}
      className="flex gap-1 text-lg font-light font-mono float-end"
    >
      {isPending ? t("signing-out") || "Signing out..." : t("sign-out")}
    </Button>
  );
};
