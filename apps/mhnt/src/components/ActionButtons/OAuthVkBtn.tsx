"use client";

import { useAppParams } from "@/lib/hooks";
import { APP_ROUTES_CONFIG } from "@/lib/routes/routes";
import { generateVkAuthRequestUrl } from "@/lib/utils/generateVkAuthRequestUrl";
import { Button } from "@shared/ui/components/button";
import { GetComponentProps } from "@shared/ui/lib/types";
import { useRouter } from "next/navigation";

export const OAuthVkBtn = (props: GetComponentProps<typeof Button>) => {
  const { getParam } = useAppParams();
  const router = useRouter();

  const handleClick = async () => {
    const returnTo = getParam("returnTo");
    sessionStorage.setItem(
      "OAUTH_RETURN_TO",
      returnTo ?? APP_ROUTES_CONFIG.AUCTION.href
    );

    const authUrl = await generateVkAuthRequestUrl();
    router.push(authUrl);
  };

  return (
    <Button {...props} onClick={handleClick}>
      {"VK Sign In"}
    </Button>
  );
};
