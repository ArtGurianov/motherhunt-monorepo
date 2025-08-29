"use client";

import { StatusCard, StatusCardTypes } from "@shared/ui/components/StatusCard";
import { ReactNode } from "react";
import { authClient } from "@/lib/auth/authClient";
import { useRouter } from "next/navigation";
import { generateUpdatedPathString } from "@/lib/utils/generateUpdatedPathString";
import { APP_ROUTES, APP_ROUTES_CONFIG } from "@/lib/routes/routes";

interface SignedOutGuardProps {
  children: ReactNode;
}

export const SignedOutGuard = ({ children }: SignedOutGuardProps) => {
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();

  const router = useRouter();

  if (isSessionPending)
    return (
      <StatusCard
        type={StatusCardTypes.LOADING}
        title={"Loading..."}
        className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
      />
    );

  if (session) {
    router.push(
      generateUpdatedPathString(
        APP_ROUTES_CONFIG[APP_ROUTES.AUCTION].href,
        new URLSearchParams({
          toast: "SIGNED_IN",
        })
      )
    );
  }

  return children;
};
