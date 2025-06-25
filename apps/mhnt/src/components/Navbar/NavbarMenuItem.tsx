"use client";

import { Button } from "@shared/ui/components/button";
import Link from "next/link";
import Image from "next/image";

interface NavbarMenuItemProps {
  label: string;
  href: string;
  svgPath: string;
  onHoverStateChange: (_: number | null) => void;
  isActive: boolean;
  hoveredIndex: number | null;
  currentIndex: number;
}

export const NavbarMenuItem = ({
  label,
  href,
  svgPath,
  isActive,
  hoveredIndex,
  currentIndex,
  onHoverStateChange,
}: NavbarMenuItemProps) => {
  return (
    <Button
      asChild
      className="relative grow md:h-full aspect-square"
      size="reset"
      variant="ghost"
      onMouseOver={() => onHoverStateChange(currentIndex)}
      onMouseOut={() => onHoverStateChange(null)}
    >
      <Link href={href}>
        <Image
          className="absolute top-0 left-0"
          src={svgPath}
          alt={label}
          sizes="100vh"
          priority
          fill
        />
        <Image
          className="absolute -z-10 top-0 left-0"
          src={
            (isActive && hoveredIndex === null) || hoveredIndex === currentIndex
              ? "/capture-btn-active.png"
              : "/capture-btn-inactive.png"
          }
          alt="navbar-btn-icon"
          sizes="100vh"
          priority
          fill
        />
      </Link>
    </Button>
  );
};
