import { ValueOf } from "@shared/ui/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../card";
import { cn } from "@shared/ui/lib/utils";

export const StatusCardTypes = {
  LOADING: "LOADING",
  ERROR: "ERROR",
  SUCCESS: "SUCCESS",
} as const;
export type StatusCardType = ValueOf<typeof StatusCardTypes>;

interface StatusCardProps {
  className?: string;
  title: string;
  description?: string;
  type?: StatusCardType;
  children?: React.ReactNode;
}

export const StatusCard = ({
  className,
  title,
  description,
  type = StatusCardTypes.SUCCESS,
  children,
}: StatusCardProps) => {
  return (
    <Card
      className={cn(
        "flex flex-col items-center justify-center gap-2",
        {
          "bg-red-900/90": type === StatusCardTypes.ERROR,
        },
        className
      )}
    >
      <CardHeader className="text-center">
        <CardTitle className="text-nowrap font-mono text-2xl">
          {title}
        </CardTitle>
        {description ? (
          <CardDescription className="font-sans text-lg text-card">
            {description}
          </CardDescription>
        ) : null}
      </CardHeader>
      {children ? <CardContent>{children}</CardContent> : null}
    </Card>
  );
};
