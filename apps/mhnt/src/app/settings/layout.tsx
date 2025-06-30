"use client";

import { LoaderCircle } from "lucide-react";
import {
  ReactNode,
  Suspense,
  unstable_ViewTransition as ViewTransition,
} from "react";

export default function TransitionLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <ViewTransition
      onUpdate={(instance) => {
        instance.old.animate(
          {
            transform: ["translateX(0)", "translateX(-100%)"],
            opacity: [1, 0],
          },
          { duration: 300 }
        );
        instance.new.animate(
          {
            transform: ["translateX(100%)", "translateX(0)"],
            opacity: [0, 1],
          },
          { duration: 300 }
        );
      }}
    >
      <Suspense
        fallback={
          <div className="h-full w-full px-2 flex justify-center items-center">
            <LoaderCircle className="animate-spin h-12 w-12" />
          </div>
        }
      >
        <div className="h-full w-full px-2">{children}</div>
      </Suspense>
    </ViewTransition>
  );
}
