import { useRouter } from "next/navigation";
import { useAppParams } from "./useAppParams";
import { APP_ROUTES, APP_ROUTES_CONFIG, AppRoute } from "../routes/routes";

export const useCloseIntercepted = () => {
  const router = useRouter();
  const { getParam, deleteParam, getUpdatedParamsString } = useAppParams();
  const returnTo = getParam("returnTo");

  return {
    onInterceptedClose: () => {
      deleteParam("returnTo");
      router.push(
        `${returnTo ? APP_ROUTES_CONFIG[returnTo as AppRoute].href : APP_ROUTES_CONFIG[APP_ROUTES.AUCTION].href}${getUpdatedParamsString()}`
      );
    },
  };
};
