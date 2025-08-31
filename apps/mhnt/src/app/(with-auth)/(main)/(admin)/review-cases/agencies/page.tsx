import { Organization } from "@shared/db";
import { AgenciesApplicationsWidget } from "./_widgets/AgenciesApplicationsWidget";
import { prismaClient } from "@/lib/db";
import { ORG_TYPES } from "@/lib/utils/types";
import { formatErrorMessage } from "@/lib/utils/createActionResponse";

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
    return formatErrorMessage(error);
  }

  return <AgenciesApplicationsWidget data={pendingOrganizations} />;
}
