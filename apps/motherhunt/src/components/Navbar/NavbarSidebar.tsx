"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@shared/ui/components/sheet";
import Link from "next/link";

import Image from "next/image";
import { NavbarItemData } from "./types";
import { Button } from "@shared/ui/components/button";
import { usePathname } from "next/navigation";
import { ArrowBigRight } from "lucide-react";
import { LangSwitcher } from "@/components/LangSwitcher/LangSwitcher";
import { useTranslations } from "next-intl";
import { getAppURL } from "@shared/ui/lib/utils";

interface NavbarSidebarProps {
  items: NavbarItemData[];
  isOpen: boolean;
  onOpenChange: (_: boolean) => void;
}

export const NavbarSidebar = ({
  items,
  isOpen,
  onOpenChange,
}: NavbarSidebarProps) => {
  const t = useTranslations("NAV");
  const pathname = usePathname();

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="p-0 transition-none">
        <SheetHeader className="p-4 border-b bg-primary">
          <SheetTitle className="font-sans text-background font-semibold text-2xl">
            {t("menu-title")}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-6 grow">
          <LangSwitcher className="grid-cols-4 gap-4 px-4" />
          <div className="flex flex-col grow w-full justify-center items-center gap-6 px-4">
            {items.map(({ href, translationKey }) => (
              <div
                key={href}
                className="flex items-center justify-center w-full max-w-[320px]"
              >
                <div className="relative w-full h-full">
                  <Button
                    asChild
                    className="text-3xl font-mono h-full w-full py-6"
                    size="reset"
                    variant="ghost"
                  >
                    <Link href={href}>{t(translationKey)}</Link>
                  </Button>
                  <Image
                    className="absolute -z-10 top-0 left-0"
                    src={
                      pathname === href
                        ? "/capture-btn-horizontal-active.png"
                        : "/capture-btn-horizontal-inactive.png"
                    }
                    alt="navbar-btn-icon"
                    sizes="100vh"
                    priority
                    fill
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="w-full flex justify-center items-center px-8 mb-8">
            <Button asChild className="w-full py-2 text-lg" size="lg">
              <Link href={getAppURL()} className="h-full">
                <span className="text-4xl flex gap-1 items-center justify-center h-full">
                  <ArrowBigRight />
                  {t("platform-btn-label")}
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
