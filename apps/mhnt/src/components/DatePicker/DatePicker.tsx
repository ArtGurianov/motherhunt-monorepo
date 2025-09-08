"use client";

import { ZERO_DATE } from "@/lib/utils/constants";
import { Button } from "@shared/ui/components/button";
import { Calendar } from "@shared/ui/components/calendar";
import { FormControl } from "@shared/ui/components/form";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@shared/ui/components/popover";
import { GetComponentProps } from "@shared/ui/lib/types";
import { cn } from "@shared/ui/lib/utils";
import { CalendarIcon } from "lucide-react";
import { useCallback, useMemo, useRef } from "react";

interface DatePickerProps
  extends Omit<GetComponentProps<typeof Button>, "value"> {
  value: Date;
  onValueSelect: (_: Date | undefined) => void;
}

export const DatePicker = (props: DatePickerProps) => {
  const { value, onValueSelect, ...rest } = props;

  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const handleDateSelect = useCallback(
    (date: Date | undefined) => {
      onValueSelect(date);
      closeBtnRef.current?.click();
    },
    [onValueSelect]
  );

  const isZeroDate = useMemo(() => {
    return value.getTime() === ZERO_DATE.getTime();
  }, [value]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant={"flat"}
            className={cn(
              "relative pl-3 py-2 h-auto text-lg font-normal bg-secondary border-2"
            )}
            {...rest}
          >
            <span
              className={cn(
                "w-full text-start",
                (!value || isZeroDate) && "text-primary/50 text-sm py-1"
              )}
            >
              {value && !isZeroDate
                ? value.toLocaleDateString()
                : "Pick a date"}
            </span>
            <CalendarIcon className="absolute ml-auto right-2 top-1/2 -translate-y-1/2" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleDateSelect}
          disabled={(date) =>
            date > new Date() || date < new Date("1900-01-01")
          }
          captionLayout="dropdown"
        />
        <PopoverClose btnRef={closeBtnRef} />
      </PopoverContent>
    </Popover>
  );
};
