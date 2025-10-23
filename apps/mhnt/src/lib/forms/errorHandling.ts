import { toast } from "@shared/ui/components/sonner";
import { formatErrorMessage } from "@/lib/utils/errorUtils";

export interface FormErrorOptions {
  inline?: (message: string) => void;
  toast?: boolean;
  fallbackMessage?: string;
}

export const handleFormError = (
  error: unknown,
  options: FormErrorOptions = {},
): string => {
  const { inline, toast: showToast, fallbackMessage = "An error occurred" } = options;

  let errorMessage: string;
  try {
    errorMessage = formatErrorMessage(error);
  } catch {
    errorMessage =
      error instanceof Error ? error.message : fallbackMessage;
  }

  if (!errorMessage || errorMessage === "An error occurred") {
    errorMessage = fallbackMessage;
  }

  if (inline) {
    inline(errorMessage);
  }

  if (showToast) {
    toast(errorMessage);
  }

  return errorMessage;
};
