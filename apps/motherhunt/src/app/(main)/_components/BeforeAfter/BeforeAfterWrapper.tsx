"use client";

import { PageSection } from "@shared/ui/components/PageSection";
import { ReactNode, useRef } from "react";
import { BeforeAfterAnimated } from "./BeforeAfterAnimated";

export const BeforeAfterWrapper = ({ children }: { children: ReactNode }) => {
  const childrenContainerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <PageSection fullWidth className="relative w-full">
        <div className="absolute top-0 w-full h-8 bg-gradient-to-b from-background/100 to-background/0" />
        <div className="absolute top-0 w-full h-4 torn-bottom bg-background bg-[linear-gradient(to_right,var(--secondary)_1px,transparent_1px),linear-gradient(to_bottom,var(--secondary),transparent_1px)] bg-[size:70px_70px]" />
        <div className="absolute bottom-0 w-full h-8 bg-gradient-to-t from-background/100 to-background/0" />
        <div className="absolute bottom-0 w-full h-4 torn-top bg-background bg-[linear-gradient(to_right,var(--secondary)_1px,transparent_1px),linear-gradient(to_bottom,var(--secondary),transparent_1px)] bg-[size:70px_70px]" />
        <BeforeAfterAnimated childrenContainerRef={childrenContainerRef} />
      </PageSection>
      <div
        className="w-full flex flex-col justify-start items-center bg-background bg-[linear-gradient(to_right,var(--secondary)_1px,transparent_1px),linear-gradient(to_bottom,var(--secondary),transparent_1px)] bg-[size:70px_70px]"
        ref={childrenContainerRef}
      >
        <div className="absolute -top-8 w-full h-8 bg-gradient-to-t from-background/100 to-background/0" />
        <div className="torn-top absolute -top-4 w-full h-4 bg-background bg-[linear-gradient(to_right,var(--secondary)_1px,transparent_1px),linear-gradient(to_bottom,var(--secondary),transparent_1px)] bg-[size:70px_70px]" />
        {children}
      </div>
    </>
  );
};
