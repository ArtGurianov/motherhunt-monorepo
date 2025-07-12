import { usePathname, useSearchParams } from "next/navigation";

export const useAppParams = () => {
  const pathname = usePathname();
  const params = useSearchParams();
  const updatedParams = new URLSearchParams(params.toString());

  const setParam = (key: string, value: string) =>
    updatedParams.set(key, value);
  const getParam = (key: string) => params.get(key);
  const deleteParam = (key: string) => updatedParams.delete(key);
  const getUpdatedParamsString = () =>
    updatedParams.size ? `?${updatedParams.toString()}` : "";
  const getUpdatedPathString = () => `${pathname}${getUpdatedParamsString()}`;

  return {
    getParam,
    setParam,
    deleteParam,
    getUpdatedParamsString,
    getUpdatedPathString,
  };
};
