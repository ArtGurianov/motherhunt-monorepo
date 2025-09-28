"use client";

import { OAuthFacebookBtn } from "@/components/ActionButtons/OAuthFacebookBtn";
import { OAuthVkBtn } from "@/components/ActionButtons/OAuthVkBtn";
import { CUSTOM_MEMBER_ROLES } from "@/lib/auth/customRoles";
import { useAuthenticated } from "@/lib/hooks";
import { APP_ROUTES, APP_ROUTES_CONFIG } from "@/lib/routes/routes";
import { Button } from "@shared/ui/components/button";
import { StatusCard, StatusCardTypes } from "@shared/ui/components/StatusCard";
import Link from "next/link";

export const SwitchAccountModelPageContent = () => {
  const { user, activeMember } = useAuthenticated();

  if (activeMember?.role === CUSTOM_MEMBER_ROLES.MODEL_ROLE) {
    return (
      <StatusCard
        type={StatusCardTypes.ERROR}
        title="Already signed in as model."
        className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
      />
    );
  }

  if (user.modelSocialId || user.modelOrganizationId) {
    return (
      <div className="flex flex-col gap-4">
        <h2>{"Social account already linked."}</h2>
        <Button asChild>
          <Link href={APP_ROUTES_CONFIG[APP_ROUTES.MODAL_SWITCH].href}>
            {"To account switching =>"}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-6 justify-center items-center">
      <OAuthVkBtn />
      <OAuthFacebookBtn />
    </div>
  );
};
