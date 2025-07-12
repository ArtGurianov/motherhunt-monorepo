import { useRouter } from "next/navigation";
import { useAppParams } from "./useAppParams";

export const useCloseIntercepted = () => {
  const router = useRouter();
  const { getParam, deleteParam, getUpdatedParamsString } = useAppParams();
  const returnTo = getParam("returnTo");

  return {
    onInterceptedClose: () => {
      deleteParam("returnTo");
      router.push(`${returnTo ?? "/"}${getUpdatedParamsString()}`);
    },
  };
};
