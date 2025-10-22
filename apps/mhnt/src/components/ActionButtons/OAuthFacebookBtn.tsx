"use client";

import { Button } from "@shared/ui/components/button";
import { GetComponentProps } from "@shared/ui/lib/types";
import { useTranslations } from "next-intl";

export const OAuthFacebookBtn = (props: GetComponentProps<typeof Button>) => {
  const t = useTranslations("OAUTH");

  return (
    <Button {...props} disabled>
      {t("facebook-button")}
    </Button>
  );
};
