import { ReactNode } from "react";
import { TransitionLayoutContent } from "../_widgets/TransitionLayoutContent";

export default function TransitionLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <TransitionLayoutContent>{children}</TransitionLayoutContent>;
}
