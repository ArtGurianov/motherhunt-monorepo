"use client";

import { acceptInvitation } from "@/actions/acceptInvitation";
import { ErrorBlock } from "@/components/Forms";
import { useAppParams, useAuthenticated } from "@/lib/hooks";
import { useInvitationDetails } from "@/lib/hooks/useInvitationDetails";
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
import {
  StatusCard,
  StatusCardLoading,
  StatusCardTypes,
} from "@shared/ui/components/StatusCard";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

const REDIRECT_PATH_SUCCESS = generateUpdatedPathString(
  APP_ROUTES_CONFIG[APP_ROUTES.AUCTION].href,
  new URLSearchParams({
    toast: "SUCCESS",
  })
);

export const AcceptInvitationWidget = () => {
  const { getParam } = useAppParams();
  const invitationId = getParam("invitationId");
  const {
    data,
    isPending: isDataPending,
    error,
  } = useInvitationDetails(invitationId);

  const { user } = useAuthenticated();

  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (isDataPending) {
    return <StatusCardLoading />;
  }

  if (!invitationId) {
    return (
      <StatusCard
        type={StatusCardTypes.ERROR}
        title="Invitation ID not provided"
      />
    );
  }

  if (error) {
    return (
      <StatusCard
        type={StatusCardTypes.ERROR}
        title="Error while fetching invitation data"
      />
    );
  }

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
        setErrorMessage(
          error instanceof Error ? error.message : "Something went wrong."
        );
      }
    });
  };

  if (data.email !== user.email) {
    return (
      <StatusCard type={StatusCardTypes.ERROR} title="Not an invitee email" />
    );
  }

  if (data.status !== "pending") {
    return (
      <StatusCard type={StatusCardTypes.ERROR} title="Invitation Closed" />
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
