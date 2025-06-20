"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@shared/ui/components/button";
import { NavbarSidebar } from "./NavbarSidebar";
import { NAVBAR_ITEMS } from "./constants";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { NavbarItem } from "./NavbarItem";
import {
  ArrowBigRight,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";
import { useWindowSize } from "@shared/ui/lib/hooks";
import { cn, getAppURL } from "@shared/ui/lib/utils";
import { LangSwitcher } from "@/components/LangSwitcher/LangSwitcher";
import { useTranslations } from "next-intl";

export const Navbar = () => {
  const t = useTranslations("NAV");
  const [isBurgerMenu, setIsBurgerMenu] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const pathname = usePathname();

  const { width: windowWidth } = useWindowSize();
  const imageContainerRef = useRef<HTMLImageElement | null>(null);
  const itemsContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!itemsContainerRef.current || !imageContainerRef.current) return;

    setIsBurgerMenu(
      itemsContainerRef.current.offsetWidth +
        imageContainerRef.current.offsetWidth >
        document.body.clientWidth
    );
  }, [windowWidth]);

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navbarOpacity = Math.min(scrollY / 100, 1);

  const displayItems = (
    <div className="flex justify-center items-center px-6 gap-4 h-full">
      {NAVBAR_ITEMS.map(({ href, translationKey }, index) => (
        <NavbarItem
          key={href}
          href={href}
          isActive={pathname === href}
          hoveredIndex={hoveredIndex}
          currentIndex={index}
          onHoverStateChange={(value: number | null) => setHoveredIndex(value)}
          translationKey={translationKey}
        />
      ))}
      <div className="flex gap-2 ml-4">
        <LangSwitcher className="grid-cols-2 grid-rows-2" />
        <Button asChild className="px-8 py-2 text-lg" size="lg">
          <Link
            href={getAppURL()}
            className="h-full"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="text-3xl flex gap-1 items-center justify-center h-full">
              <ArrowBigRight />
              {t("platform-btn-label")}
            </span>
          </Link>
        </Button>
      </div>
    </div>
  );

  return (
    <nav className="w-full h-nav flex justify-start items-center sticky z-10 top-0 border-b-4 border-border shadow-secondary shadow-xl overflow-clip">
      <div
        style={{ opacity: navbarOpacity }}
        className="absolute bg-background/90 h-nav w-full -z-10 top-0 left-0"
      />
      <div
        ref={imageContainerRef}
        className="border-r-6 border-b-2 border-accent-foreground h-full bg-primary shrink-0 max-w-[calc(100vw-var(--spacing)*16)]"
      >
        <Button asChild variant="ghost" size="reset" className="h-full w-auto">
          <Link href="/" className="px-2 sm:px-6 py-1 h-full w-auto">
            <Image
              src="/motherhunt-logo.png"
              width="0"
              height="0"
              sizes="100vh"
              alt="MotherHunt"
              className="h-18 w-64"
              priority
            />
          </Link>
        </Button>
      </div>

      <NavbarSidebar
        items={NAVBAR_ITEMS}
        isOpen={isSidebarOpen}
        onOpenChange={(value) => {
          setIsSidebarOpen(value);
        }}
      />

      <div
        className={cn("flex grow justify-end h-full", { hidden: isBurgerMenu })}
      >
        {displayItems}
      </div>

      <div
        className={cn("grow shrink-0 flex items-center justify-end", {
          hidden: !isBurgerMenu,
        })}
      >
        <Button variant="ghost" onClick={() => setIsSidebarOpen(true)}>
          {isSidebarOpen ? <ChevronsLeftIcon /> : <ChevronsRightIcon />}
        </Button>
      </div>

      {/* CHECKING DIMENSIONS */}
      <div ref={itemsContainerRef} className="absolute z-50 invisible h-nav">
        {displayItems}
      </div>
    </nav>
  );
};
