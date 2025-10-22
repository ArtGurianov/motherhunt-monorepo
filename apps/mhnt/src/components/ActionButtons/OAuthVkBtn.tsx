"use client";

import { useAppParams } from "@/lib/hooks";
import { APP_ROUTES, APP_ROUTES_CONFIG } from "@/lib/routes/routes";
import { generateVkAuthRequestUrl } from "@/lib/utils/generateVkAuthRequestUrl";
import { Button } from "@shared/ui/components/button";
import { GetComponentProps } from "@shared/ui/lib/types";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export const OAuthVkBtn = (props: GetComponentProps<typeof Button>) => {
  const t = useTranslations("OAUTH");
  const { getParam, getUpdatedParamsString, deleteParam } = useAppParams();
  const router = useRouter();

  const handleClick = async () => {
    const returnTo = getParam("returnTo");
    deleteParam("returnTo");
    sessionStorage.setItem(
      "OAUTH_RETURN_TO",
      `${returnTo ?? APP_ROUTES_CONFIG[APP_ROUTES.AUCTION].href}${getUpdatedParamsString()}`,
    );

    const authUrl = await generateVkAuthRequestUrl();
    router.push(authUrl);
  };

  return (
    <Button {...props} onClick={handleClick}>
      {t("vk-button")}
    </Button>
  );
};
