import "server-only";

import { unstable_cacheTag as cacheTag } from "next/cache";
import { prismaClient } from "@/lib/db";
import { ORG_TYPES } from "@/lib/utils/types";
import { cache } from "react";

export const getPendingOrganizations = cache(async () => {
  "use cache";
  cacheTag("pending-organizations");

  return await prismaClient.organization.findMany({
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
});
