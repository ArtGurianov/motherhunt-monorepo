import { APIError } from "better-auth/api";

export class AppBusinessError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "AppBusinessError";
    this.statusCode = statusCode;
  }
}

export const formatErrorMessage = (error: unknown) => {
  return error instanceof AppBusinessError || error instanceof APIError
    ? error.message
    : "A server error has occurred.";
};

export const formatErrorStatusCode = (error: unknown) => {
  let statusCode = 500;

  if (error instanceof APIError) {
    statusCode =
      error.status === "FORBIDDEN" || error.status === "UNAUTHORIZED"
        ? 403
        : 400;
  }
  if (error instanceof AppBusinessError) {
    statusCode = error.statusCode;
  }

  return statusCode;
};
