/* eslint-disable @typescript-eslint/no-explicit-any */

import { AppClientError } from "@shared/ui/lib/utils/appClientError";
import { APIError } from "better-auth/api";

type ActionResponsePrimitive =
  | boolean
  | string
  | number
  | Date
  | bigint
  | null
  | undefined;

type ActionResponseData =
  | ActionResponsePrimitive
  | Array<ActionResponseData>
  | { [key: string | number]: ActionResponseData };

interface CreateActionResponseProps<TData extends ActionResponseData> {
  data?: TData;
  error?: unknown;
}

type ActionResponseSuccess<TData extends ActionResponseData> = {
  success: true;
  data: TData | null;
  errorMessage: null;
};

type ActionResponseFail = {
  success: false;
  data: null;
  errorMessage: string;
};

export const formatErrorMessage = (error?: any) => {
  const isClientError = error instanceof AppClientError;
  const isAuthError = error instanceof APIError;
  if (!isClientError && !isAuthError) {
    try {
      console.error(error.message);
    } catch {
      console.error("A server error of unexpected format has occured.");
    }
  }
  return isClientError || isAuthError
    ? error.message
    : "A server error has occured.";
};

export function createActionResponse<TData extends ActionResponseData>(props?: {
  data: TData;
  error?: undefined;
}): ActionResponseSuccess<TData>;

export function createActionResponse(props: {
  error: unknown;
}): ActionResponseFail;

export function createActionResponse<TData extends ActionResponseData>(
  props?: CreateActionResponseProps<TData>
): ActionResponseSuccess<TData> | ActionResponseFail {
  if (props?.error) {
    return {
      success: false,
      data: null,
      errorMessage: formatErrorMessage(props?.error),
    };
  } else {
    return {
      success: true,
      data: typeof props?.data === "undefined" ? null : (props.data ?? null),
      errorMessage: null,
    };
  }
}
