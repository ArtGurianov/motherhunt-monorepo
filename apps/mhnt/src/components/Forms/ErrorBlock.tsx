import { cn } from "@shared/ui/lib/utils";
import React from "react";

interface ErrorBlockProps {
  message?: string | null;
  className?: string;
}

export const ErrorBlock: React.FC<ErrorBlockProps> = ({
  message,
  className,
}) => {
  if (!message) return null;
  return (
    <div
      aria-live="polite"
      role="alert"
      className={cn("text-red-500 text-sm font-bold text-center", className)}
    >
      {message}
    </div>
  );
};
