import { cn } from "@shared/ui/lib/utils";
import { ReactNode } from "react";

interface InlineDataContentProps {
  children: ReactNode;
  className?: string;
  sideContent?: ReactNode;
}

export const InlineDataContent = ({
  children,
  className,
  sideContent,
}: InlineDataContentProps) => {
  return (
    <div
      className={cn(
        "flex h-full bg-linear-to-br from-secondary/95 to-secondary/80 rounded-lg w-full border-2 overflow-clip",
        className
      )}
    >
      <div className="px-2 py-2 text-xl font-mono grow">{children}</div>
      {sideContent ? (
        <div className="flex self-stretch p-2 justify-center items-center border-l-1 bg-main/30">
          {sideContent}
        </div>
      ) : null}
    </div>
  );
};
