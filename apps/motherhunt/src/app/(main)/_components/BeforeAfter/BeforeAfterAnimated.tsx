"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
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

  const height = useTransform(scrollYProgress, [0, 1], [heightFrom, heightTo]);

  const scrollMotionSpring = useSpring(height, {
    stiffness: 100,
    bounce: 0,
    mass: 0.1,
    duration: 0.25,
  });

  return (
    <motion.div
      className="overflow-clip vignette"
      style={{ height: scrollMotionSpring }}
    >
      <BeforeAfterContent containerRef={containerRef} targetRef={targetRef} />
    </motion.div>
  );
};
