"use client";

import { APP_ROUTES, APP_ROUTES_CONFIG } from "@/lib/routes/routes";
import { generateUpdatedPathString } from "@/lib/utils/generateUpdatedPathString";
import { Button } from "@shared/ui/components/button";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

const REDIRECT_PATH_SUCCESS = generateUpdatedPathString(
  APP_ROUTES_CONFIG[APP_ROUTES.AUCTION].href,
  new URLSearchParams({
    action: "SIGN_OUT",
  })
);

export const SignOutBtn = () => {
  const router = useRouter();
  const t = useTranslations("ACTION_BUTTONS");

  const onClick = () => {
    router.push(REDIRECT_PATH_SUCCESS);
  }

  return (
    <Button
      onClick={onClick}
      className="flex gap-1 text-lg font-light font-mono float-end"
    >
      {t("sign-out")}
    </Button>
  );
};
