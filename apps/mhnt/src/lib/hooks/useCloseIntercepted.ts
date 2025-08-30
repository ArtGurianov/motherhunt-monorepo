import { useRouter } from "next/navigation";
import { useAppParams } from "./useAppParams";
import { APP_ROUTES, APP_ROUTES_CONFIG } from "../routes/routes";
import { useCallback } from "react";

export const useCloseIntercepted = () => {
  const router = useRouter();
  const { getParam, deleteParam, getUpdatedParamsString } = useAppParams();

  const onInterceptedClose = useCallback(() => {
    const returnTo = getParam("returnTo");
    deleteParam("returnTo");
    const updatedParams = getUpdatedParamsString();
    const defaultHref = APP_ROUTES_CONFIG[APP_ROUTES.AUCTION].href;

    router.push(`${returnTo ?? defaultHref}${updatedParams}`);
  }, [router, getParam, deleteParam, getUpdatedParamsString]);

  return { onInterceptedClose };
};
