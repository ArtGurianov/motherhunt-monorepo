import { Organization } from "@shared/db";
import { AgenciesApplicationsWidget } from "./_widgets/AgenicesApplicationsWidget";
import { prismaClient } from "@/lib/db";

export default async function AgenciesApplicationsPage() {
  let pendingOrganizations: Organization[] | null = null;
  try {
    pendingOrganizations = await prismaClient.organization.findMany({
      where: {
        NOT: {
          metadata: {
            contains: "reviewerId",
          },
        },
      },
    });
  } catch {
    return "server error";
  }

  return <AgenciesApplicationsWidget data={pendingOrganizations} />;
}
