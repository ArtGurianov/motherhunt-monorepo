import { cn } from "@shared/ui/lib/utils";
import { Label } from "../label";

interface InlineDataLabelProps {
  className?: string;
  children: string;
}

export const InlineDataLabel = ({
  className,
  children,
}: InlineDataLabelProps) => {
  return <Label className={cn("px-1", className)}>{children}</Label>;
};
