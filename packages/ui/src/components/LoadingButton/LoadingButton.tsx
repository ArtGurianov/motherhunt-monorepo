"use client";

import { Button, type buttonVariants, type VariantProps } from "../button";
import { LoaderCircle } from "lucide-react";
import * as React from "react";

export interface LoadingButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  asChild?: boolean;
}

export const LoadingButton = React.forwardRef<
  HTMLButtonElement,
  LoadingButtonProps
>(({ isLoading = false, disabled, children, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      disabled={isLoading || disabled}
      aria-disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <LoaderCircle className="animate-spin h-8 w-8" />
      ) : (
        children
      )}
    </Button>
  );
});

LoadingButton.displayName = "LoadingButton";
