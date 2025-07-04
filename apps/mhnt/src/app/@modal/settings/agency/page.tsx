import { AgenciesList } from "@/components/SettingsContent/SettingsContentAgency/AgenciesList";
import { Button } from "@shared/ui/components/button";
import Link from "next/link";

export default function AgencySettings() {
  return (
    <div className="flex flex-col gap-2 w-full h-full justify-center items-center">
      <AgenciesList />
      <span className="text-2xl font-mono">{"- or -"}</span>
      <div className="flex flex-col gap-1">
        <Button asChild size="lg" className="font-mono">
          <Link href="/agency/apply" rel="noopener noreferrer" target="_blank">
            {"Register an Agency"}
          </Link>
        </Button>
        <Button asChild variant="link" className="font-mono">
          <Link href="/settings/agency/requests">{"view my requests"}</Link>
        </Button>
      </div>
    </div>
  );
}
