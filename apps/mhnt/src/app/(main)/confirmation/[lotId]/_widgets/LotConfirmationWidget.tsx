"use client";

import { InfoCard } from "@/components/InfoCard/InfoCard";

export const LotConfirmationWidget = () => {
  // TODO:
  // 1. check signed in Role
  // 2. if not a model - button to redirect in model login (new window)

  return (
    <InfoCard title={"profile confirmation"}>
      <span>{"1. Confirm correctness of your profile"}</span>
      <span>{"2. LogIn with social that proves your identity"}</span>
      <span>{"3. Sign or Reject"}</span>
    </InfoCard>
  );
};
