"use client";

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
            "flex justify-between items-center bg-linear-to-l from-accent-foreground/90 to-accent-foreground/50 border-foreground px-4 py-px cursor-pointer",
            {
              "border-b-2": isOpen,
              "border-b-0": !isOpen,
            }
          )}
          onClick={onToggle}
        >
          <span className="font-mono text-sm text-primary/90">
            <ChevronDown
              className={cn("size-6 mr-1 inline-block", {
                "rotate-180": isOpen,
              })}
            />
            {isOpen ? "collapse" : "expand"}
          </span>
          <span className="text-lg font-light font-mono text-main/90">{`.${title}`}</span>
        </CardTitle>
      </CardHeader>
      <CardContent
        className={cn(
          "grid transition-all duration-300 ease-in-out px-2 lg:px-5",
          {
            "grid-rows-[0fr]": !isOpen,
            "grid-rows-[1fr]": isOpen,
          }
        )}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-3 p-1">{children}</div>
        </div>
      </CardContent>
    </Card>
  );
};
