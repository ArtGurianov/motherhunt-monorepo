import { Button } from "@shared/ui/components/button";
import Link from "next/link";

export default function AgencySettings() {
  return (
    <div className="flex flex-col gap-2">
      {"Agency Settings"}
      <Button asChild>
        <Link href="/settings">{"Settings"}</Link>
      </Button>
    </div>
  );
}
