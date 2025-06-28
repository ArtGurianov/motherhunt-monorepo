import { Label } from "../label";

interface InlineDataLabelProps {
  className?: string;
  children: string;
}

export const InlineDataLabel = ({
  className,
  children,
}: InlineDataLabelProps) => {
  return <Label className={className}>{children}</Label>;
};
