"use client";

import { Button } from "@shared/ui/components/button";
import type { NavbarItemData } from "./types";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface NavbarItemProps extends NavbarItemData {
  onHoverStateChange: (_: number | null) => void;
  isActive: boolean;
  hoveredIndex: number | null;
  currentIndex: number;
}

export const NavbarItem = ({
  href,
  translationKey,
  isActive,
  hoveredIndex,
  currentIndex,
  onHoverStateChange,
}: NavbarItemProps) => {
  const t = useTranslations("NAV");

  return (
    <div className="flex items-center justify-center h-full aspect-square p-1">
      <div className="relative w-full h-full">
        <Button
          asChild
          className="text-xl font-mono h-full w-full"
          size="reset"
          variant="ghost"
          onMouseOver={() => onHoverStateChange(currentIndex)}
          onMouseOut={() => onHoverStateChange(null)}
        >
          <Link href={href}>{t(translationKey)}</Link>
        </Button>
        <Image
          className="absolute -z-10 top-0 left-0"
          src={
            (isActive && hoveredIndex === null) || hoveredIndex === currentIndex
              ? "/capture-btn-square-active.png"
              : "/capture-btn-square-inactive.png"
          }
          alt="navbar-btn-icon"
          sizes="100vh"
          priority
          fill
        />
      </div>
    </div>
  );
};
