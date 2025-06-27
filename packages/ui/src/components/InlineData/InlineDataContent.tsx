import { cn } from "@shared/ui/lib/utils";
import { ReactNode } from "react";

interface InlineDataContentProps {
  children: ReactNode;
  className?: string;
}

export const InlineDataContent = ({
  children,
  className,
}: InlineDataContentProps) => {
  return (
    <div
      className={cn(
        "bg-linear-to-br from-secondary/95 to-secondary/80 rounded-lg w-full px-2 py-2 border-2 overflow-clip text-xl font-mono",
        className
      )}
    >
      {children}
    </div>
  );
};
