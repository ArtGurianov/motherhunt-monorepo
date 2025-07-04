"use client";

import Link from "next/link";
import { Button } from "@shared/ui/components/button";
import { usePathname } from "next/navigation";
import { AppLocale, cn, getAppLocale, getSiteURL } from "@shared/ui/lib/utils";
import { APP_LOCALE_TO_LANG_MAP } from "@shared/ui/lib/utils";
import { useState } from "react";

export const LangSwitcher = ({ className }: { className?: string }) => {
  const pathname = usePathname();
  const activeLocale = getAppLocale();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className={cn("grid gap-1", className)}>
      {Object.entries(APP_LOCALE_TO_LANG_MAP).map(([locale, lang], index) => (
        <Button
          asChild
          key={locale}
          size="sm"
          className={cn(
            "font-mono text-foreground/80 hover:text-foreground/100",
            {
              "bg-accent-foreground/30 shadow-transparent translate-x-boxShadowX translate-y-boxShadowY":
                (activeLocale === locale && hoveredIndex === null) ||
                hoveredIndex === index,
            }
          )}
          onMouseOver={() => setHoveredIndex(index)}
          onMouseOut={() => setHoveredIndex(null)}
        >
          <Link
            className="h-full w-full"
            href={`${getSiteURL(locale as AppLocale)}${pathname}`}
          >
            {lang}
          </Link>
        </Button>
      ))}
    </div>
  );
};
