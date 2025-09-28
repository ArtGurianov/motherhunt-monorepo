import "server-only";

import { headers } from "next/headers";
import { APIError } from "better-auth/api";
import { getSessionToken } from "@/lib/auth/getSessionToken";
import { getSessionByToken } from "./getSessionByToken";
import { cache } from "react";

export const getSession = cache(async () => {
  const headersList = await headers();
  if (!headersList) {
    throw new APIError("UNAUTHORIZED", { message: "Unauthorized" });
  }

  const token = await getSessionToken(headersList);
  if (!token) throw new APIError("UNAUTHORIZED", { message: "Unauthorized" });

  const result = await getSessionByToken(token);
  if (!result.success)
    throw new APIError("UNAUTHORIZED", { message: "Unauthorized" });

  return result.data;
});
