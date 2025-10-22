import { generateUpdatedParamsString } from "./generateUpdatedParamsString";

export const generateUpdatedPathString = (
  pathname: string,
  params: URLSearchParams,
) => `${pathname}${generateUpdatedParamsString(params)}`;
