"use client";

import { FormControl, FormItem, FormMessage } from "@shared/ui/components/form";
import { LoaderCircle } from "lucide-react";
import { RefObject } from "react";

interface TurnStileFormItemProps {
  ref: RefObject<HTMLDivElement | null>;
}

export const TurnStileFormItem = ({ ref }: TurnStileFormItemProps) => (
  <FormItem>
    <FormControl>
      <div className="relative h-16 w-full">
        <LoaderCircle className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-10 h-10 animate-spin" />
        <div className="absolute z-10 w-full h-full">
          <div
            ref={ref}
            data-sitekey={
              process.env.NODE_ENV === "production"
                ? process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
                : "1x00000000000000000000AA"
            }
            data-size={"flexible"}
          />
        </div>
      </div>
    </FormControl>
    <FormMessage />
  </FormItem>
);
