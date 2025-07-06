import { Organization } from "@shared/db";
import { AgenciesApplicationsWidget } from "./_widgets/AgenicesApplicationsWidget";
import { prismaClient } from "@/lib/db";
import { AppClientError } from "@shared/ui/lib/utils/appClientError";

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
  } catch (error) {
    if (error instanceof AppClientError) {
      return error.message;
    }
    return "Server error";
  }

  return <AgenciesApplicationsWidget data={pendingOrganizations} />;
}
