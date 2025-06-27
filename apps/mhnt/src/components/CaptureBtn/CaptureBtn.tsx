"use client";

import {
  Button,
  buttonVariants,
  VariantProps,
} from "@shared/ui/components/button";
import { cn } from "@shared/ui/lib/utils";
import Image from "next/image";
import { useState } from "react";

type CaptureBtnShape = "square" | "horizontal";

const CAPTURE_BTN_SRC_CONFIG: {
  [S in CaptureBtnShape]: {
    [K in "active" | "inactive"]: string;
  };
} = {
  square: {
    active: "/capture-btn-square-active.png",
    inactive: "/capture-btn-square-inactive.png",
  },
  horizontal: {
    active: "/capture-btn-horizontal-active.png",
    inactive: "/capture-btn-horizontal-inactive.png",
  },
};

export interface CaptureBtnProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  shape?: CaptureBtnShape;
  isActive?: boolean;
}

export const CaptureBtn = ({
  children,
  className,
  shape = "square",
  isActive = false,
  onMouseOver,
  onMouseOut,
  ...rest
}: CaptureBtnProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative">
      <Button
        className={cn("", { "aspect-square": shape === "square" }, className)}
        variant="ghost"
        onMouseOver={(e) => {
          onMouseOver?.(e);
          setIsHovered(true);
        }}
        onMouseOut={(e) => {
          onMouseOut?.(e);
          setIsHovered(false);
        }}
        {...rest}
      >
        {children}
      </Button>
      <Image
        className="absolute -z-10 top-0 left-0"
        src={
          CAPTURE_BTN_SRC_CONFIG[shape][
            isActive || isHovered ? "active" : "inactive"
          ]
        }
        alt="inner-btn-icon"
        sizes="100vh"
        priority
        fill
      />
    </div>
  );
};
