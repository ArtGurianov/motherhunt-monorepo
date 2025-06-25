"use client";

import Link from "next/link";
import { Button } from "@shared/ui/components/button";
import { AppLocale, cn, getAppLocale, getSiteURL } from "@shared/ui/lib/utils";
import { APP_LANG_TO_LOCALE_MAP } from "@shared/ui/lib/utils";
import { useState } from "react";

export const LangSwitcher = () => {
  const activeLocale = getAppLocale();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="flex gap-2">
      {Object.entries(APP_LANG_TO_LOCALE_MAP).map(([locale, lang], index) => (
        <Button
          asChild
          key={locale}
          size="reset"
          className={cn(
            "font-mono text-foreground/80 hover:text-foreground/100 p-1",
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
            href={getSiteURL(locale as AppLocale)}
          >
            {lang}
          </Link>
        </Button>
      ))}
    </div>
  );
};
