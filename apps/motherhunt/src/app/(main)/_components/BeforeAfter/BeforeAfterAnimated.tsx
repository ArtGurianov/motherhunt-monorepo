"use client";

import {
  motion,
  useAnimate,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { useRef } from "react";
import { BeforeAfterContent } from "./BeforeAfterContent";

interface BeforeAfterProps {
  heightFrom: number;
  heightTo: number;
}

export const BeforeAfterAnimated = ({
  heightFrom,
  heightTo,
}: BeforeAfterProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["end center", "end start"],
  });

  const [scope, animate] = useAnimate();

  useMotionValueEvent(scrollYProgress, "change", (latestValue) => {
    animate(
      scope.current,
      { height: heightFrom + (heightTo - heightFrom) * latestValue },
      { duration: 0.1 }
    );
  });

  return (
    <motion.div
      ref={scope}
      className="overflow-clip vignette"
      style={{ height: heightFrom }}
    >
      <BeforeAfterContent containerRef={containerRef} targetRef={targetRef} />
    </motion.div>
  );
};
