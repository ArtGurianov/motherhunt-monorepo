import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppParams } from "./useAppParams";

export const useUrlParamAction = (
  key: string,
  callbackFn: (_: string) => void,
) => {
  const router = useRouter();
  const { getParam, deleteParam, getUpdatedPathString } = useAppParams();
  const value = getParam(key);

  useEffect(() => {
    if (!value) return;
    deleteParam(key);
    router.replace(getUpdatedPathString());

    const timerId = setTimeout(() => {
      callbackFn(value);
    }, 0);

    return () => {
      clearTimeout(timerId);
    };
  }, [key, callbackFn]);
};
