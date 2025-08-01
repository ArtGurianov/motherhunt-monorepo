import { InterceptedDialogDrawer } from "@/components/InterceptedDialogDrawer/InterceptedDialogDrawer";
import { ReactNode, Suspense } from "react";

interface RouteManagerProps {
  children: ReactNode;
}

export const RouteManager = ({ children }: RouteManagerProps) => {
  return (
    <Suspense>
      <InterceptedDialogDrawer targetPath={"/settings"} className="px-0">
        {children}
      </InterceptedDialogDrawer>
    </Suspense>
  );
};
