"use client";

import { authClient } from "@/lib/auth/authClient";
import { AGENCY_ROLES } from "@/lib/auth/permissions/agency-permissions";
import { Button } from "@shared/ui/components/button";
import { UserCog } from "lucide-react";

export const NavbarAccount = () => {
  const { data: session } = authClient.useSession();

  return (
    <div className="flex h-full px-6 lg:px-8 justify-center items-center gap-4 bg-linear-to-bl from-main/100 to-main/80 border-r">
      <div className="flex flex-col items-center">
        <span className="text-md text-center">{"Currently logged in as:"}</span>
        <Button
          variant="ghost"
          size="reset"
          className="text-2xl text-center font-mono underline"
        >
          {session?.session.activeOrganizationId
            ? session?.session.activeOrganizationRole
            : "SCOUTER"}
        </Button>
      </div>
      <Button
        size="reset"
        variant="secondary"
        className="p-1 [&_svg]:pointer-events-auto [&_svg]:size-8"
      >
        <UserCog />
      </Button>
    </div>
  );
};
