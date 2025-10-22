import { cn } from "@shared/ui/lib/utils";
import { ElementType, ReactNode } from "react";

interface HeadingProps {
  children: ReactNode;
  className?: string;
  variant?: "page" | "card";
  tag?: ElementType<object>;
}

export const Heading = ({
  children,
  className,
  variant = "page",
  tag = "h1",
}: HeadingProps) => {
  const Tag = tag;
  return (
    <Tag
      className={cn(
        "text-center font-mono bg-linear-to-r px-16",
        variant === "page" &&
          "py-2 font-medium text-4xl from-secondary/0 via-secondary/50 to-secondary/0",
        variant === "card" &&
          "py-1 font-light text-2xl from-accent-foreground/0 via-accent-foreground/30 to-accent-foreground/0",
        className,
      )}
    >
      {children}
    </Tag>
  );
};
