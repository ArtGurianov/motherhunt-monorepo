"use client";

import { useAuth } from "@/components/AppProviders/AuthProvider";
import { ErrorBlock } from "@/components/Forms";
import { authClient } from "@/lib/auth/authClient";
import { APP_ROUTES, APP_ROUTES_CONFIG } from "@/lib/routes/routes";
import { generateUpdatedPathString } from "@/lib/utils/generateUpdatedPathString";
import { Button } from "@shared/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shared/ui/components/card";
import { StatusCard, StatusCardTypes } from "@shared/ui/components/StatusCard";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

const REDIRECT_PATH_SUCCESS = generateUpdatedPathString(
  APP_ROUTES_CONFIG[APP_ROUTES.AUCTION].href,
  new URLSearchParams({
    toast: "SUCCESS",
  })
);

interface AcceptInvitationWidgetProps {
  invitationId: string;
  inviteeEmail: string;
}

export const AcceptInvitationWidget = ({
  invitationId,
  inviteeEmail,
}: AcceptInvitationWidgetProps) => {
  const { user } = useAuth();

  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const acceptInvitation = () => {
    startTransition(async () => {
      setErrorMessage(null);
      const result = await authClient.organization.acceptInvitation({
        invitationId,
      });
      if (result.error) {
        setErrorMessage(result.error.statusText);
        return;
      }
      router.push(REDIRECT_PATH_SUCCESS);
    });
  };

  if (inviteeEmail !== user.email) {
    return (
      <StatusCard type={StatusCardTypes.ERROR} title="Not an invitee email!" />
    );
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{"Accept your invitation"}</CardTitle>
        <CardDescription>
          {"You were invited to join an agency as a booker! Click to accept!"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-col gap-4">
        <div className="w-full flex justify-center items-center">
          <Button size="lg" onClick={acceptInvitation} disabled={isPending}>
            {isPending ? (
              <LoaderCircle className="py-1 animate-spin h-8 w-8" />
            ) : (
              "JOIN AGENCY"
            )}
          </Button>
        </div>
        <ErrorBlock message={errorMessage} className="mt-4" />
      </CardContent>
    </Card>
  );
};
