import "server-only";

import { cache } from "react";
import { getSession } from "./getSession";
import { getDraftsByUserId } from "./getDraftsByUserId";
import { AppClientError } from "@shared/ui/lib/utils/appClientError";

export const getMyDrafts = cache(async () => {
  const {user: { id: userId }} = await getSession();
  const result = await getDraftsByUserId(userId);
  if (!result.success) throw new AppClientError(result.errorMessage);
  
  return result.data;
});
