import { cn } from "@shared/ui/lib/utils";
import { ReactNode } from "react";

interface QuoteProps {
  children: ReactNode;
  className?: string;
}

export const Quote = ({ children, className }: QuoteProps) => {
  return (
    <h3
      className={cn(
        "text-foreground/90 border-l-4 border-accent-foreground/70 px-6 py-4 bg-linear-to-r from-accent-foreground/20 to-accent-foreground/0 text-start",
        className
      )}
    >
      {children}
    </h3>
  );
};
