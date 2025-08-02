"use client";

import { PageSection } from "@shared/ui/components/PageSection";
import { ReactNode, useRef } from "react";
import { BeforeAfterAnimated } from "./BeforeAfterAnimated";

export const BeforeAfterWrapper = ({ children }: { children: ReactNode }) => {
  const childrenContainerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <PageSection
        fullWidth
        className="relative w-full before:tearTop bg-vignette"
      >
        <BeforeAfterAnimated childrenContainerRef={childrenContainerRef} />
      </PageSection>
      <div
        className="w-full relative flex flex-col justify-start items-center bg-background bg-[linear-gradient(to_right,var(--secondary)_1px,transparent_1px),linear-gradient(to_bottom,var(--secondary),transparent_1px)] bg-[size:70px_70px]"
        ref={childrenContainerRef}
      >
        {children}
      </div>
    </>
  );
};
