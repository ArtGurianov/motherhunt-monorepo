"use client";

import { Button } from "@shared/ui/components/button";
import { UserCog } from "lucide-react";

export const Navbar = () => {
  return (
    <nav className="w-full h-nav px-2 md:px-12 fixed bottom-4">
      <div className="flex w-full h-full border bg-secondary/40 rounded-full overflow-clip">
        <div className="flex h-full px-6 lg:px-8 justify-center items-center gap-4 bg-linear-to-bl from-main/100 to-main/80 border-r">
          <div className="flex flex-col items-center">
            <span className="text-md text-center">
              {"Currently logged in as:"}
            </span>
            <Button
              variant="ghost"
              size="reset"
              className="text-2xl text-center font-mono underline"
            >
              {"SCOUTER"}
            </Button>
          </div>
          <Button
            size="reset"
            variant="secondary"
            className="p-1 [&_svg]:pointer-events-auto [&_svg]:size-8"
          >
            <UserCog />
          </Button>
        </div>
        <div className="grow h-full"></div>
        {/* <div className="flex justify-center items-center px-6 gap-4 h-full">
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
        <div className="flex md:hidden grow shrink-0 items-center justify-end">
          <Button variant="ghost" onClick={() => setIsMenuOpen(true)}>
            {isMenuOpen ? <ChevronsLeftIcon /> : <ChevronsRightIcon />}
          </Button>
        </div> */}
      </div>
    </nav>
  );
};
