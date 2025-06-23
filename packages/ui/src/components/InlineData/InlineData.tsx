import { ReactNode } from "react";
import { InlineDataLabel } from ".";
import { cn } from "@shared/ui/lib/utils";

interface InlineDataProps {
  className?: string;
  labelClassName?: string;
  label: string;
  children: ReactNode;
}

export const InlineData = ({
  className,
  label,
  children,
  labelClassName,
}: InlineDataProps) => {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-start justify-center gap-1",
        className
      )}
    >
      <InlineDataLabel className={cn("px-1", labelClassName)} label={label} />
      <div className="bg-linear-to-br from-secondary/95 to-secondary/80 rounded-lg w-full px-2 py-2 border-2">
        {children}
      </div>
    </div>
  );
};
