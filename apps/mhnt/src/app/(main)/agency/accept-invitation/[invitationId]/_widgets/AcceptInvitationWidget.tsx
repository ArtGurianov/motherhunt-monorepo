"use client";

import { ErrorBlock } from "@/components/Forms/ErrorBlock";
import { authClient } from "@/lib/auth/authClient";
import { Button } from "@shared/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shared/ui/components/card";
import { LoaderCircle } from "lucide-react";
import { redirect } from "next/navigation";
import { useState, useTransition } from "react";

interface AcceptInvitationWidgetProps {
  invitationId: string;
}

export const AcceptInvitationWidget = ({
  invitationId,
}: AcceptInvitationWidgetProps) => {
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
      redirect("/?toast=SUCCESS");
    });
  };

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
