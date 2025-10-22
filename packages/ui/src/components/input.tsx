import * as React from "react";

import { cn } from "@shared/ui/lib/utils";

interface AppInputProps extends React.ComponentProps<"input"> {
  sideContent?: React.ReactNode;
  containerClassName?: string;
}

function Input({
  className,
  containerClassName,
  sideContent,
  type,
  ...props
}: AppInputProps) {
  return (
    <div
      className={cn(
        "flex w-full bg-secondary rounded-base group/focusable",
        containerClassName,
      )}
    >
      <input
        type={type}
        data-slot="input"
        className={cn(
          "grow rounded-base border-2 border-border selection:bg-main selection:text-main-foreground pl-3 py-2 text-lg font-base text-foreground placeholder:text-foreground/50 placeholder:text-sm focus-visible:outline-hidden focus-visible:ring-2 ring-ring disabled:cursor-not-allowed disabled:opacity-50 font-mono",
          className,
          { "rounded-r-none border-r-0": !!sideContent },
        )}
        {...props}
      />
      {sideContent ? (
        <div
          className={cn(
            "flex self-stretch p-2 justify-center items-center border-2 border-l-1 rounded-r-base bg-main/30 group-focus-within/focusable:ring-2 ring-ring",
            { "opacity-50": !!props.disabled },
          )}
        >
          {sideContent}
        </div>
      ) : null}
    </div>
  );
}

export { Input };
