"use client";

import { OAuthFacebookBtn } from "@/components/ActionButtons/OAuthFacebookBtn";
import { OAuthVkBtn } from "@/components/ActionButtons/OAuthVkBtn";
import { authClient } from "@/lib/auth/authClient";
import { CUSTOM_MEMBER_ROLES } from "@/lib/auth/customRoles";
import { useActiveMember } from "@/lib/hooks";
import { Button } from "@shared/ui/components/button";
import Link from "next/link";

export const SwitchAccountModelPageContent = () => {
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();

  const { data: activeMember, isPending: isActiveMemberPending } =
    useActiveMember();

  if (isSessionPending || isActiveMemberPending) return "loading...";

  if (activeMember?.role === CUSTOM_MEMBER_ROLES.MODEL_ROLE) {
    return "Already signed in as model";
  }

  if (session?.user.modelSocialId || session?.user.modelOrganizationId) {
    return (
      <div className="flex flex-col gap-4">
        <h2>{"Social account already linked."}</h2>
        <Button asChild>
          <Link href="/settings/switch-account">
            {"To account switching =>"}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-4 justify-center items-center">
      <OAuthVkBtn />
      <OAuthFacebookBtn />
    </div>
  );
};
