"use client";

import { Quote } from "@shared/ui/components/Quote";
import { Checkbox } from "@shared/ui/components/checkbox";
import { Ban, LoaderCircle } from "lucide-react";
import { useState } from "react";

interface ToggleStateFieldProps {
  label: string;
  currentValue: boolean;
  onToggle: () => Promise<void>;
}

export const ToggleStateField = ({
  label,
  currentValue,
  onToggle,
}: ToggleStateFieldProps) => {
  const [value, setValue] = useState(currentValue);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  return (
    <Quote className="flex py-px px-2 items-center justify-between">
      <span className="text-sm font-mono font-thin">{label}</span>
      <div className="flex gap-1 h-full justify-center items-center">
        {isLoading ? (
          <LoaderCircle className="py-1 animate-spin h-6 w-6" />
        ) : null}
        {isError ? <Ban className="py-1 h-6 w-6" /> : null}
        <Checkbox
          checked={value}
          onCheckedChange={() => {
            setIsLoading(true);
            setIsError(false);
            onToggle()
              .then(() => {
                setValue((prev) => !prev);
              })
              .catch(() => {
                setIsError(true);
              })
              .finally(() => {
                setIsLoading(false);
              });
          }}
        />
      </div>
    </Quote>
  );
};
