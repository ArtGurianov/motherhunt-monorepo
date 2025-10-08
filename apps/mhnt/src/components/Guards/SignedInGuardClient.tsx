"use client";

import {
  StatusCard,
  StatusCardLoading,
  StatusCardTypes,
} from "@shared/ui/components/StatusCard";
import { ReactNode, Suspense } from "react";
import { Button } from "@shared/ui/components/button";
import { InterceptedLink } from "../InterceptedLink/InterceptedLink";
import { APP_ROUTES, APP_ROUTES_CONFIG } from "@/lib/routes/routes";
import { useAuth } from "@/lib/hooks";

interface SignedInGuardProps {
  children: ReactNode;
}

export const SignedInGuardClient = ({ children }: SignedInGuardProps) => {
  const { user, isPending, isLoading } = useAuth();

  if (isPending || isLoading) {
    return <StatusCardLoading />;
  }

  if (!user) {
    return (
      <StatusCard
        type={StatusCardTypes.ERROR}
        title={"Unauthorized"}
        description={`Must sign in to continue.`}
        className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
      >
        <Suspense>
          <Button asChild size="lg" type="submit" className="w-full">
            <InterceptedLink href={APP_ROUTES_CONFIG[APP_ROUTES.SIGN_IN].href}>
              {"Sign In"}
            </InterceptedLink>
          </Button>
        </Suspense>
      </StatusCard>
    );
  }

  return children;
};
