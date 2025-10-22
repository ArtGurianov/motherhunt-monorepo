import { cn } from "@shared/ui/lib/utils";
import { ReactNode } from "react";

interface InlineDataContentProps {
  children: ReactNode;
  className?: string;
  sideContent?: ReactNode;
  disabled?: boolean;
}

export const InlineDataContent = ({
  children,
  className,
  sideContent,
  disabled = false,
}: InlineDataContentProps) => {
  return (
    <div
      className={cn(
        "flex h-full bg-linear-to-br from-secondary/95 to-secondary/80 rounded-lg w-full border-2 overflow-clip",
        className,
        {
          "border-border/50 cursor-not-allowed": disabled,
          "border-border/100 cursor-auto": !disabled,
        },
      )}
    >
      <span
        className={cn("px-2 py-2 text-xl font-mono grow", {
          "opacity-50": disabled,
          "opacity-100": !disabled,
        })}
      >
        {children}
      </span>
      {sideContent ? (
        <div
          className={cn(
            "flex self-stretch p-2 justify-center items-center border-l-1 bg-main/30",
            {
              "border-border/50": disabled,
              "border-border/100": !disabled,
            },
          )}
        >
          {sideContent}
        </div>
      ) : null}
    </div>
  );
};
