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
        "text-center font-medium text-4xl font-mono p-2 bg-linear-to-r from-secondary/0 via-secondary/50 to-secondary/0 mb-6 px-16",
        className
      )}
    >
      {children}
    </Tag>
  );
};
