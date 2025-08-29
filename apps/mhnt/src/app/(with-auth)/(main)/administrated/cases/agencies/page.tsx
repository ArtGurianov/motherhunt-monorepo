import { Organization } from "@shared/db";
import { AgenciesApplicationsWidget } from "./_widgets/AgenciesApplicationsWidget";
import { prismaClient } from "@/lib/db";
import { AppClientError } from "@shared/ui/lib/utils/appClientError";
import { ORG_TYPES } from "@/lib/utils/types";

export default async function AgenciesApplicationsPage() {
  let pendingOrganizations: Organization[] | null = null;
  try {
    pendingOrganizations = await prismaClient.organization.findMany({
      where: {
        metadata: {
          contains: ORG_TYPES.AGENCY,
        },
        AND: {
          NOT: {
            metadata: {
              contains: "reviewerAddress",
            },
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
