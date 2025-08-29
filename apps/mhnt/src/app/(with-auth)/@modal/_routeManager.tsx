import { InterceptedDialogDrawer } from "@/components/InterceptedDialogDrawer/InterceptedDialogDrawer";
import { APP_ROUTES, APP_ROUTES_CONFIG } from "@/lib/routes/routes";
import { ReactNode, Suspense } from "react";

interface RouteManagerProps {
  children: ReactNode;
}

export const RouteManager = ({ children }: RouteManagerProps) => {
  return (
    <Suspense>
      <InterceptedDialogDrawer
        targetPath={APP_ROUTES_CONFIG[APP_ROUTES.MODAL_SETTINGS].href}
        className="px-0"
      >
        {children}
      </InterceptedDialogDrawer>
    </Suspense>
  );
};
