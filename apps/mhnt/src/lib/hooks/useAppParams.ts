import { usePathname, useSearchParams } from "next/navigation";
import { generateUpdatedParamsString } from "../utils/generateUpdatedParamsString";
import { generateUpdatedPathString } from "../utils/generateUpdatedPathString";

export const useAppParams = () => {
  const pathname = usePathname();
  const params = useSearchParams();
  const updatedParams = new URLSearchParams(params.toString());

  const setParam = (key: string, value: string) =>
    updatedParams.set(key, value);
  const getParam = (key: string) => params.get(key);
  const deleteParam = (key: string) => updatedParams.delete(key);
  const getUpdatedParamsString = () =>
    generateUpdatedParamsString(updatedParams);
  const getUpdatedPathString = () =>
    generateUpdatedPathString(pathname, updatedParams);

  return {
    entries: params.entries(),
    getParam,
    setParam,
    deleteParam,
    getUpdatedParamsString,
    getUpdatedPathString,
  };
};
