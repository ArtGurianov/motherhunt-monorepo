"use client";

import { authClient } from "@/lib/auth/authClient";
import { formatErrorMessage } from "@/lib/utils/createActionResponse";
import { Button } from "@shared/ui/components/button";
import { toast } from "@shared/ui/components/sonner";
import { useTransition } from "react";
import { useAuth } from "../AppProviders/AuthProvider";
import { LoaderCircle } from "lucide-react";
import { GetComponentProps } from "@shared/ui/lib/types";

export const ScouterSignInBtn = (props: GetComponentProps<typeof Button>) => {
  const { user, activeMember, refetch } = useAuth();

  const [isTransitionPending, startTransition] = useTransition();

  return (
    <Button
      {...props}
      className="[&_svg]:size-6"
      disabled={
        isTransitionPending ||
        activeMember?.organizationId === user.scoutingOrganizationId
      }
      onClick={() => {
        startTransition(async () => {
          try {
            await authClient.organization.setActive({
              organizationId: user.scoutingOrganizationId,
            });
            refetch();
            toast("Switched to scouter");
          } catch (error) {
            toast(formatErrorMessage(error));
          }
        });
      }}
    >
      {isTransitionPending ? (
        <LoaderCircle className="animate-spin h-6 w-6" />
      ) : (
        "SCOUTER"
      )}
    </Button>
  );
};
