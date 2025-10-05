import "server-only";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import { formatErrorMessage, formatErrorStatusCode } from "./errorUtils";

export interface CreateApiResponseProps {
  data?: unknown;
  error?: unknown;
}

export type ApiResponse = {
  success: boolean;
  data: unknown | null;
  errorMessage: string | null;
};

export function createApiResponse(
  props?: CreateApiResponseProps
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: !!props?.error,
      data: props?.data ?? null,
      errorMessage: props?.error ? formatErrorMessage(props.error) : null,
    },
    { status: props?.error ? formatErrorStatusCode(props.error) : 200 }
  );
}
