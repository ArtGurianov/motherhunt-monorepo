"use client";

import Link from "next/link";
import Image from "next/image";
import { CaptureBtn, CaptureBtnProps } from "@/components/CaptureBtn";

interface NavbarMenuItemProps extends CaptureBtnProps {
  label: string;
  href: string;
  svgPath: string;
  isActive: boolean;
}

export const NavbarMenuItem = ({
  label,
  href,
  svgPath,
  ...rest
}: NavbarMenuItemProps) => {
  return (
    <CaptureBtn {...rest}>
      <Link href={href}>
        <Image
          className="absolute top-0 left-0"
          src={svgPath}
          alt={label}
          sizes="100vh"
          priority
          fill
        />
      </Link>
    </CaptureBtn>
  );
};
