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

interface CreateActionResponsePropsSuccess<TData extends ActionResponseData> {
  data: TData;
}

interface CreateActionResponsePropsError {
  error: unknown;
}

type ActionResponseSuccessWithData<TData extends ActionResponseData> = {
  success: true;
  data: TData;
};

type ActionResponseSuccessWithoutData = {
  success: true;
  data: null;
};

type ActionResponseFail = {
  success: false;
  errorMessage: string;
};

export const formatErrorMessage = (error: unknown) => {
  const isClientError = error instanceof AppClientError;
  const isAuthError = error instanceof APIError;
  if (!isClientError && !isAuthError) {
    console.error(
      typeof error === "string"
        ? error
        : !!error && typeof error === "object" && "message" in error
          ? error.message
          : "A server error of unexpected format has occurred."
    );
  }
  return isClientError || isAuthError
    ? error.message
    : "A server error has occurred.";
};

// Function overloads
export function createActionResponse(): ActionResponseSuccessWithoutData;
export function createActionResponse<TData extends ActionResponseData>(
  props: CreateActionResponsePropsSuccess<TData>
): ActionResponseSuccessWithData<TData>;
export function createActionResponse(
  props: CreateActionResponsePropsError
): ActionResponseFail;

// Implementation
export function createActionResponse<TData extends ActionResponseData>(
  props?:
    | CreateActionResponsePropsError
    | CreateActionResponsePropsSuccess<TData>
):
  | ActionResponseSuccessWithoutData
  | ActionResponseSuccessWithData<TData>
  | ActionResponseFail {
  if (!props) {
    return {
      success: true,
      data: null,
    };
  } else if ("error" in props) {
    return {
      success: false,
      errorMessage: formatErrorMessage(props.error),
    };
  } else {
    return {
      success: true,
      data: props.data,
    };
  }
}
