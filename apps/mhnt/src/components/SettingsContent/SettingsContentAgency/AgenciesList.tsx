"use client";

import { InfoCard } from "@/components/InfoCard/InfoCard";
import { authClient } from "@/lib/auth/authClient";
import { redirect } from "next/navigation";

export const AgenciesList = () => {
  const { isPending, data } = authClient.useSession();
  if (isPending) return "loading...";
  if (!data) redirect("/signin");

  return <InfoCard title="switch">{"hey"}</InfoCard>;
};
