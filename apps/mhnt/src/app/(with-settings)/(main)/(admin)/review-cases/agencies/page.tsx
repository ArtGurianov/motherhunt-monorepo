import { StatusCard, StatusCardTypes } from "@shared/ui/components/StatusCard";
import { AgenciesApplicationsWidget } from "./_widgets/AgenciesApplicationsWidget";
import { getPendingOrganizations } from "@/data/pendingOrganizations/getPendingOrganizations";

export default async function AgenciesApplicationsPage() {
  try {
    const organizations = await getPendingOrganizations();
    return <AgenciesApplicationsWidget data={organizations} />;
  } catch (error) {
    return (
      <StatusCard
        type={StatusCardTypes.ERROR}
        title="An error occured"
        description={
          error instanceof Error ? error.message : "Something went wrong."
        }
      />
    );
  }
}
