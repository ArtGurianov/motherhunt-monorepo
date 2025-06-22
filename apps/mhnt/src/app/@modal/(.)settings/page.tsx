import { InterceptedDialogDrawer } from "@/components/InterceptedDialogDrawer/InterceptedDialogDrawer";
import { Suspense } from "react";

export default function SettingsPage() {
  return (
    <div>
      <Suspense>
        <InterceptedDialogDrawer
          targetPath={"/settings"}
          title={"Auth Details"}
        >
          {"Auth Details"}
        </InterceptedDialogDrawer>
      </Suspense>
    </div>
  );
}
