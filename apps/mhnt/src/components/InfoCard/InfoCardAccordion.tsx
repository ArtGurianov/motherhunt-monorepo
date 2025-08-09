"use client";

import { Button } from "@shared/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shared/ui/components/card";
import { cn } from "@shared/ui/lib/utils";
import { ChevronDown } from "lucide-react";
import { ReactNode } from "react";

interface InfoCardAccordionProps {
  title: string;
  children: ReactNode;
  className?: string;
  isOpen: boolean;
  onToggle: () => void;
}

export const InfoCardAccordion = ({
  title,
  children,
  className,
  isOpen,
  onToggle,
}: InfoCardAccordionProps) => {
  return (
    <Card
      className={cn("pt-0 overflow-clip w-full max-w-lg", className, {
        "pb-4 gap-2": isOpen,
        "pb-0 gap-0": !isOpen,
      })}
    >
      <CardHeader className="w-full px-0">
        <CardTitle
          className={cn(
            "flex justify-between items-center bg-linear-to-l from-accent-foreground/90 to-accent-foreground/50 border-foreground px-4 py-px",
            {
              "border-b-2": isOpen,
              "border-b-0": !isOpen,
            }
          )}
        >
          <Button
            className="[&_svg]:size-6"
            size="reset"
            variant="ghost"
            onClick={onToggle}
          >
            <ChevronDown className={cn("", { "rotate-180": isOpen })} />
          </Button>
          <span className="text-lg font-light font-mono text-main/90">{`.${title}`}</span>
        </CardTitle>
      </CardHeader>
      <CardContent
        className={cn("grid transition-all duration-300 ease-in-out", {
          "grid-rows-[0fr]": !isOpen,
          "grid-rows-[1fr]": isOpen,
        })}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-3">{children}</div>
        </div>
      </CardContent>
    </Card>
  );
};
