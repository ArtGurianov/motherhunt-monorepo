import { useRouter } from "next/navigation";
import { useAppParams } from "./useAppParams";
import { APP_ROUTES_CONFIG, AppRoute } from "../routes/routes";

export const useCloseIntercepted = () => {
  const router = useRouter();
  const { getParam, deleteParam, getUpdatedParamsString } = useAppParams();
  const returnTo = getParam("returnTo");

  return {
    onInterceptedClose: () => {
      deleteParam("returnTo");
      router.push(
        `${returnTo ? APP_ROUTES_CONFIG[returnTo as AppRoute].href : APP_ROUTES_CONFIG.AUCTION.href}${getUpdatedParamsString()}`
      );
    },
  };
};
