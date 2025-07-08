import { cn } from "@shared/ui/lib/utils";
import { ElementType, ReactNode } from "react";

interface HeadingProps {
  children: ReactNode;
  className?: string;
  tag?: ElementType<object>;
}

export const Heading = ({ children, className, tag = "h1" }: HeadingProps) => {
  const Tag = tag;
  return (
    <Tag
      className={cn(
        "w-full text-center font-medium text-4xl font-mono p-2 bg-linear-to-r from-accent-foreground/0 via-accent-foreground/50 to-accent-foreground/0",
        className
      )}
    >
      {children}
    </Tag>
  );
};
