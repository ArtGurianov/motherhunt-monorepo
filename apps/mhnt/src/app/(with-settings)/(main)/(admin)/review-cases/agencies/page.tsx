import { StatusCard, StatusCardTypes } from "@shared/ui/components/StatusCard";
import { AgenciesApplicationsWidget } from "./_widgets/AgenciesApplicationsWidget";
import { getPendingOrganizations } from "@/data/getPendingOrganizations";

export default async function AgenciesApplicationsPage() {
  const result = await getPendingOrganizations();
  if (!result.success)
    return (
      <StatusCard
        type={StatusCardTypes.ERROR}
        title="An error occured"
        description={result.errorMessage}
      />
    );

  return <AgenciesApplicationsWidget data={result.data} />;
}
