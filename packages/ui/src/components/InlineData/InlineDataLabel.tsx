import { Label } from "../label";

interface InlineDataLabelProps {
  className?: string;
  label: string;
}

export const InlineDataLabel = ({ className, label }: InlineDataLabelProps) => {
  return <Label className={className}>{label}</Label>;
};
