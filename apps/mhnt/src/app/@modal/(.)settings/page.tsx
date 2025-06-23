import { InterceptedLink } from "@/components/InterceptedLink/InterceptedLink";
import { Button } from "@shared/ui/components/button";
import { Suspense } from "react";

export default function SettingsPage() {
  return (
    <div>
      <span>{"SETTINGS PAGE"}</span>
      <Suspense fallback="loading...">
        <Button asChild>
          <InterceptedLink href={"/settings/test"}>{"test"}</InterceptedLink>
        </Button>
      </Suspense>
    </div>
  );
}
