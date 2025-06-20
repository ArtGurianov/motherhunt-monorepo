"use client";

import { Button } from "@shared/ui/components/button";
import { useWindowSize } from "@shared/ui/lib/hooks";
import { ChevronsLeftIcon, ChevronsRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAVBAR_ITEMS } from "./constants";
import { NavbarItem } from "./NavbarItem";

export const Navbar = () => {
  const [_, setIsBurgerMenu] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  return (
    <nav className="w-full h-nav flex justify-start items-center sticky border-b-4 border-border shadow-secondary shadow-xl overflow-clip">
      <div
        style={{ opacity: navbarOpacity }}
        className="absolute bg-background/90 h-nav w-full -z-10 top-0 left-0"
      />
      <div
        ref={imageContainerRef}
        className="border-l-8 border-b-4 border-accent-foreground h-full bg-primary shrink-0 max-w-[calc(100vw-var(--spacing)*16)]"
      >
        <Button asChild variant="ghost" size="reset" className="h-full w-auto">
          <Link href="/" className="h-full w-auto">
            <Image
              src="/mhnt-logo.png"
              width="0"
              height="0"
              sizes="100vh"
              alt="MHNT logo"
              className="h-22 w-22 mx-2"
              priority
            />
          </Link>
        </Button>
      </div>

      <div className="hidden md:flex grow justify-end h-full">
        <div className="flex justify-center items-center px-6 gap-4 h-full">
          {NAVBAR_ITEMS.map(({ href, translationKey }, index) => (
            <NavbarItem
              key={href}
              href={href}
              isActive={pathname === href}
              hoveredIndex={hoveredIndex}
              currentIndex={index}
              onHoverStateChange={(value: number | null) =>
                setHoveredIndex(value)
              }
              translationKey={translationKey}
            />
          ))}
        </div>
      </div>

      <div className="flex md:hidden grow shrink-0 items-center justify-end">
        <Button variant="ghost" onClick={() => setIsMenuOpen(true)}>
          {isMenuOpen ? <ChevronsLeftIcon /> : <ChevronsRightIcon />}
        </Button>
      </div>
    </nav>
  );
};
