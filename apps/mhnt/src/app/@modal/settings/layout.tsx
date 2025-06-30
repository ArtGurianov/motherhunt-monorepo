"use client";

import { ReactNode } from "react";

export default function Layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <div className="h-full w-full px-2">{children}</div>;
}
