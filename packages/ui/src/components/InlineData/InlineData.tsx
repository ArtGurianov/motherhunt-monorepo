import { ReactNode } from "react";
import { InlineDataLabel } from ".";
import { cn } from "@shared/ui/lib/utils";

interface InlineDataProps {
  className?: string;
  children: ReactNode;
}

export const InlineData = ({ className, children }: InlineDataProps) => {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-start justify-center gap-1",
        className
      )}
    >
      {children}
    </div>
  );
};
