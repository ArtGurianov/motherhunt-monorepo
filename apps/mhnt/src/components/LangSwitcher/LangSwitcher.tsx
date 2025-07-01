"use client";

import { changeUserLocale } from "@/actions/changeUserLocale";
import { AppLocale, getAppLocale } from "@shared/ui/lib/utils";
import { APP_LOCALE_TO_LANG_MAP } from "@shared/ui/lib/utils";
import { useState } from "react";
import { CaptureBtn } from "@/components/CaptureBtn";

export const LangSwitcher = () => {
  const activeLocale = getAppLocale();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="relative flex gap-2 px-2 py-1 border-2 rounded-base shadow-shadow">
      {Object.entries(APP_LOCALE_TO_LANG_MAP).map(([locale, lang], index) => (
        <CaptureBtn
          key={locale}
          size="reset"
          className="px-2 py-1"
          onClick={async () => {
            await changeUserLocale(locale as AppLocale);
          }}
          onMouseOver={() => setHoveredIndex(index)}
          onMouseOut={() => setHoveredIndex(null)}
          isActive={activeLocale === locale && !hoveredIndex}
        >
          {lang}
        </CaptureBtn>
      ))}
      <div className="absolute -z-20 bg-main left-0 top-0 h-full w-full" />
    </div>
  );
};
