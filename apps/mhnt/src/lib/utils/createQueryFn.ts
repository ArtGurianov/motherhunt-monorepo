import { ApiResponse } from "./createApiResponse";

export const createQueryFn = <T>(requestUrl: string) => {
  return async () => {
    const res = await fetch(requestUrl);
    const { success, data, errorMessage } = (await res.json()) as ApiResponse;
    if (!success) throw new Error(errorMessage ?? "Something went wrong.");

    return data as T;
  };
};
