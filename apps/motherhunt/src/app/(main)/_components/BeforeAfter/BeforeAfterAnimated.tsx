"use client";

import { motion, useScroll, useTransform } from "framer-motion";
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

  return (
    <motion.div className="overflow-clip vignette" style={{ height }}>
      <BeforeAfterContent containerRef={containerRef} targetRef={targetRef} />
    </motion.div>
  );
};
