import "server-only";

import { cache } from "react";
import { getSession } from "../session/getSession";
import { getAgencyBookersById } from "./getAgencyBookersById";
import { AppBusinessError } from "@/lib/utils/errorUtils";
import { ORG_TYPES } from "@/lib/utils/types";

export const getActiveAgencyBookers = cache(async () => {
  const {
    session: { activeOrganizationId, activeOrganizationType },
  } = await getSession();

  if (!activeOrganizationId)
    throw new AppBusinessError("Active organization not set", 403);
  if (activeOrganizationType !== ORG_TYPES.AGENCY)
    throw new AppBusinessError("Organization must be an agency", 400);

  const bookers = await getAgencyBookersById(activeOrganizationId);

  return bookers;
});
