"use client";

import { RefObject, useEffect, useRef } from "react";
import { BeforeAfterContent } from "./BeforeAfterContent";
import { useScrollPosition } from "@/lib/hooks";

interface BeforeAfterProps {
  childrenContainerRef: RefObject<HTMLDivElement | null>;
}

export const BeforeAfterAnimated = ({
  childrenContainerRef,
}: BeforeAfterProps) => {
  const afterContainerRef = useRef<HTMLDivElement>(null);

  const { scrollPosition, windowHeight } = useScrollPosition();
  const midScreenScrollPosition = scrollPosition + windowHeight / 2;

  useEffect(() => {
    if (afterContainerRef.current && childrenContainerRef.current) {
      if (
        midScreenScrollPosition <
        midScreenScrollPosition +
          afterContainerRef.current.getBoundingClientRect().top -
          afterContainerRef.current.offsetHeight
      ) {
        childrenContainerRef.current.style.position = "absolute";
        childrenContainerRef.current.style.top = `${
          scrollPosition + afterContainerRef.current.getBoundingClientRect().top
        }px`;
      } else if (
        midScreenScrollPosition <
          midScreenScrollPosition +
            afterContainerRef.current.offsetHeight +
            afterContainerRef.current.getBoundingClientRect().top &&
        midScreenScrollPosition >
          midScreenScrollPosition +
            afterContainerRef.current.offsetHeight -
            afterContainerRef.current.getBoundingClientRect().bottom
      ) {
        childrenContainerRef.current.style.position = "fixed";
        childrenContainerRef.current.style.top = `${
          afterContainerRef.current.offsetHeight
        }px`;
      } else {
        childrenContainerRef.current.style.position = "static";
      }
    }
  }, [scrollPosition, midScreenScrollPosition]);

  return <BeforeAfterContent afterContainerRef={afterContainerRef} />;
};
