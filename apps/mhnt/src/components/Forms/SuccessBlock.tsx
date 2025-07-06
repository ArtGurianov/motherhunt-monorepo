import React from "react";

interface SuccessBlockProps {
  message?: string | null;
  className?: string;
}

export const SuccessBlock: React.FC<SuccessBlockProps> = ({
  message,
  className,
}) => {
  if (!message) return null;
  return (
    <div
      aria-live="polite"
      role="status"
      className={className ?? "text-green-600 text-sm font-bold text-center"}
    >
      {message}
    </div>
  );
};
