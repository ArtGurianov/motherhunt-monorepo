"use client";

import { PageSection } from "@shared/ui/components/PageSection";
import { useEffect, useRef, useState } from "react";
import { BeforeAfterAnimated } from "./BeforeAfterAnimated";
import { BeforeAfterContent } from "./BeforeAfterContent";

export const BeforeAfter = () => {
  const ghostContainerRef = useRef<HTMLDivElement>(null);
  const ghostTargetRef = useRef<HTMLDivElement>(null);

  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  return (
    <>
      <PageSection
        fullWidth
        className="relative w-full before:tearTop after:tearBottom bg-vignette"
      >
        {isInitialized ? (
          <BeforeAfterAnimated
            heightFrom={ghostTargetRef.current!.offsetHeight}
            heightTo={ghostContainerRef.current!.offsetHeight}
          />
        ) : null}
      </PageSection>
      {/* GHOST */}
      <PageSection fullWidth className="absolute -z-50 invisible">
        <BeforeAfterContent
          containerRef={ghostContainerRef}
          targetRef={ghostTargetRef}
        />
      </PageSection>
    </>
  );
};
