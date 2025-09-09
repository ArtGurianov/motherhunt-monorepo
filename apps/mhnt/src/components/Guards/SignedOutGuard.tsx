"use client";

import { ReactNode, useEffect } from "react";
import { authClient } from "@/lib/auth/authClient";
import { useRouter } from "next/navigation";
import { generateUpdatedPathString } from "@/lib/utils/generateUpdatedPathString";
import { APP_ROUTES, APP_ROUTES_CONFIG } from "@/lib/routes/routes";
import {
  StatusCard,
  StatusCardLoading,
  StatusCardTypes,
} from "@shared/ui/components/StatusCard";

interface SignedOutGuardProps {
  children: ReactNode;
}

export const SignedOutGuard = ({ children }: SignedOutGuardProps) => {
  // BetterAuth issue: Do not use isPending here since
  // sending magic link is changing isPending state
  // leading to sign in component complete remount (losing state)
  // Opened issue: https://github.com/better-auth/better-auth/issues/4357

  const { data: session } = authClient.useSession();

  const router = useRouter();

  useEffect(() => {
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
  }, [session]);

  if (session) {
    return <StatusCardLoading />;
  }

  return children;
};
