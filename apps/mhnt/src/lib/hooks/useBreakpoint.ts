import { ValueOf } from "@shared/ui/lib/types";
import { useWindowSize } from "./useWindowSize";

const BREAKPOINTS = {
  xs: "xs",
  sm: "sm",
  md: "md",
  lg: "lg",
  xl: "xl",
  xxl: "xxl",
} as const;

type Breakpoint = ValueOf<typeof BREAKPOINTS>;

const WINDOW_SIZES_MAP: Record<Breakpoint, number> = {
  [BREAKPOINTS.xs]: 0,
  [BREAKPOINTS.sm]: 640,
  [BREAKPOINTS.md]: 768,
  [BREAKPOINTS.lg]: 1024,
  [BREAKPOINTS.xl]: 1280,
  [BREAKPOINTS.xxl]: 1536,
};

export const useBreakpoint = (targetBreakpoint: Breakpoint) => {
  const { width } = useWindowSize();
  return width > WINDOW_SIZES_MAP[targetBreakpoint];
};
