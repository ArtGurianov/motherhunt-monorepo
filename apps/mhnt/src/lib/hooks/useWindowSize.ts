import { useState, useCallback, useLayoutEffect } from "react";

const RESIZE_THROTTLE_DELAY = 150;

/* eslint-disable @typescript-eslint/no-explicit-any */
function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastRan: number = 0;

  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now();

    if (now - lastRan >= delay) {
      func.apply(this, args);
      lastRan = now;
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(
        () => {
          func.apply(this, args);
          lastRan = Date.now();
        },
        delay - (now - lastRan),
      );
    }
  };
}

export const useWindowSize = () => {
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

  const handleResize = useCallback(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  useLayoutEffect(() => {
    handleResize();
    const throttledResize = throttle(handleResize, RESIZE_THROTTLE_DELAY);

    window.addEventListener("resize", throttledResize);

    return () => {
      window.removeEventListener("resize", throttledResize);
    };
  }, [handleResize]);

  return dimensions;
};
