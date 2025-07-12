import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shared/ui/components/card";
import { cn } from "@shared/ui/lib/utils";
import { ReactNode } from "react";

interface InfoCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export const InfoCard = ({ title, children, className }: InfoCardProps) => (
  <Card className={cn("w-full pt-0 pb-4 overflow-clip gap-2", className)}>
    <CardHeader className="w-full px-0">
      <CardTitle className="bg-linear-to-l from-accent-foreground/90 to-accent-foreground/50 border-b-2 border-foreground px-4 py-px text-md font-light font-mono text-end text-main/90">
        {`.${title}`}
      </CardTitle>
    </CardHeader>
    <CardContent className="flex flex-col gap-3">{children}</CardContent>
  </Card>
);
