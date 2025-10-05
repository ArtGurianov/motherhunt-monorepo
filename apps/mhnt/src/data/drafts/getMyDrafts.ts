import "server-only";

import { cache } from "react";
import { getSession } from "../session/getSession";
import { getDraftsByUserId } from "./getDraftsByUserId";

export const getMyDrafts = cache(async () => {
  const {
    user: { id: userId },
  } = await getSession();
  const drafts = await getDraftsByUserId(userId);

  return drafts;
});
