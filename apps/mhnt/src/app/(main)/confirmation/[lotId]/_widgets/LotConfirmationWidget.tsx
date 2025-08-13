"use client";

import { InfoCard } from "@/components/InfoCard/InfoCard";
import { authClient } from "@/lib/auth/authClient";
import { APP_ROLES } from "@/lib/auth/permissions/app-permissions";
import { generateAuthRequestUrl } from "@/lib/auth/plugins/vk/generateAuthRequestUrl";
import { Button } from "@shared/ui/components/button";
import { useRouter } from "next/navigation";

export const LotConfirmationWidget = () => {
  const router = useRouter();

  const { isPending: isSessionPending, data: sessionData } =
    authClient.useSession();

  const signIn = async () => {
    const authUrl = await generateAuthRequestUrl();
    router.push(authUrl);
  };

  if (isSessionPending) return "loading...";
  if (sessionData && sessionData.session.role !== APP_ROLES.MODEL_ROLE)
    return "Must use social login to confirm identity.";

  return (
    <InfoCard title={"profile confirmation"}>
      <span>{"1. Confirm correctness of your profile"}</span>
      <span>{"2. LogIn with social that proves your identity"}</span>
      <span>{"3. Sign or Reject"}</span>
      <Button onClick={signIn}>{"VK Sign In"}</Button>
    </InfoCard>
  );
};
