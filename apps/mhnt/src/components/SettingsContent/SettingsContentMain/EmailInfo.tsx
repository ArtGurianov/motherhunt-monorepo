"use client";

import { InfoCard } from "@/components/InfoCard/InfoCard";
import { authClient } from "@/lib/auth/authClient";

export const EmailInfo = () => {
  const session = authClient.useSession();
  return <InfoCard title="email">{"hi"}</InfoCard>;
};
