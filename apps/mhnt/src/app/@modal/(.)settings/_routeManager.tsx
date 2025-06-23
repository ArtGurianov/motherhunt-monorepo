"use client";

import { InterceptedDialogDrawer } from "@/components/InterceptedDialogDrawer/InterceptedDialogDrawer";
import { ReactNode, Suspense } from "react";

interface RouteManagerProps {
  children: ReactNode;
}

export const RouteManager = ({ children }: RouteManagerProps) => {
  return (
    <div>
      <Suspense>
        <InterceptedDialogDrawer
          targetPath={"/settings"}
          title={"User Settings"}
        >
          {children}
        </InterceptedDialogDrawer>
      </Suspense>
    </div>
  );
};
