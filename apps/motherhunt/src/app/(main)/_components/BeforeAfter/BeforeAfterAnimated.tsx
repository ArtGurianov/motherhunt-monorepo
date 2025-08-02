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

  useEffect(() => {
    if (afterContainerRef.current && childrenContainerRef.current) {
      if (
        (windowHeight * 2) / 3 <=
        afterContainerRef.current.getBoundingClientRect().top
      ) {
        childrenContainerRef.current.style.position = "absolute";
        childrenContainerRef.current.style.top = `${
          scrollPosition + afterContainerRef.current.getBoundingClientRect().top
        }px`;
      } else if (
        (windowHeight * 2) / 3 <=
        afterContainerRef.current.getBoundingClientRect().bottom
      ) {
        childrenContainerRef.current.style.position = "absolute";
        childrenContainerRef.current.style.top = `${scrollPosition + (windowHeight * 2) / 3}px`;
      } else {
        childrenContainerRef.current.style.position = "static";
      }
    }
  }, [scrollPosition, windowHeight]);

  return <BeforeAfterContent afterContainerRef={afterContainerRef} />;
};
