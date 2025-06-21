"use client";

import { NavbarAccount } from "./NavbarAccount";

export const Navbar = () => {
  return (
    <nav className="w-full h-nav px-2 md:px-12 fixed bottom-4">
      <div className="flex w-full h-full border bg-secondary/40 rounded-full overflow-clip">
        <NavbarAccount />
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
