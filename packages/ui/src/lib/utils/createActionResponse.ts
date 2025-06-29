import { AppClientError } from "./appClientError";

type NonUndefined<T> = T extends undefined ? never : T;

interface CreateActionResponseProps {
  data?: any;
  error?: any;
}

type ActionResponse = {
  success: boolean;
  data: NonUndefined<any>;
  errorMessage: string | null;
};

const formatErrorMessage = (error?: any) => {
  const isClientError = error instanceof AppClientError;
  if (!isClientError) {
    try {
      console.error(error.message);
    } catch {
      console.error("A server error of unexpected format has occured.");
    }
  }
  return isClientError ? error.message : "A server error has occured.";
};

export const createActionResponse = ({
  data,
  error,
}: CreateActionResponseProps): ActionResponse => {
  return {
    success: !error,
    data: typeof data === "undefined" ? null : data,
    errorMessage: error ? formatErrorMessage(error) : null,
  };
};
