"use client";

import { acceptInvitation } from "@/actions/acceptInvitation";
import { ErrorBlock } from "@/components/Forms";
import { useAuthenticated } from "@/lib/hooks";
import { APP_ROUTES, APP_ROUTES_CONFIG } from "@/lib/routes/routes";
import { formatErrorMessage } from "@/lib/utils/createActionResponse";
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
  const { user } = useAuthenticated();

  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAcceptInvitation = () => {
    startTransition(async () => {
      try {
        setErrorMessage(null);
        const result = await acceptInvitation(invitationId);
        if (!result.success) {
          setErrorMessage(result.errorMessage);
          return;
        }
        router.push(REDIRECT_PATH_SUCCESS);
      } catch (error) {
        setErrorMessage(formatErrorMessage(error));
      }
    });
  };

  if (inviteeEmail !== user.email) {
    return (
      <StatusCard type={StatusCardTypes.ERROR} title="Not an invitee email" />
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
          <Button
            size="lg"
            onClick={handleAcceptInvitation}
            disabled={isPending}
          >
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
