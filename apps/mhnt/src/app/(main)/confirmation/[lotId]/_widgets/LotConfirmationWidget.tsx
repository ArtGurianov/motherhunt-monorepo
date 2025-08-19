"use client";

import { InfoCard } from "@/components/InfoCard/InfoCard";
import { generateAuthRequestUrl } from "@/lib/auth/plugins/vk/generateAuthRequestUrl";
import { Button } from "@shared/ui/components/button";
import { useRouter } from "next/navigation";

export const LotConfirmationWidget = () => {
  const router = useRouter();

  const signIn = async () => {
    const authUrl = await generateAuthRequestUrl();
    router.push(authUrl);
  };

  return (
    <InfoCard title={"profile confirmation"}>
      <span>{"1. Confirm correctness of your profile"}</span>
      <span>{"2. LogIn with social that proves your identity"}</span>
      <span>{"3. Sign or Reject"}</span>
      <Button onClick={signIn}>{"VK Sign In"}</Button>
    </InfoCard>
  );
};
