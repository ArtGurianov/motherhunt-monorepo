import "server-only";

import { unstable_cacheTag as cacheTag } from "next/cache";
import { prismaClient } from "@/lib/db";
import { createActionResponse } from "@/lib/utils/createActionResponse";
import { ORG_TYPES } from "@/lib/utils/types";

export const getPendingOrganizations = async () => {
  "use cache";

  cacheTag("pending-organizations");
  try {
    const pendingOrganizations = await prismaClient.organization.findMany({
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

    return createActionResponse({ data: pendingOrganizations });
  } catch (error) {
    return createActionResponse({ error });
  }
};
