"use client";

import { initializeModelVk } from "@/actions/initializeModelVk";
import { authClient } from "@/lib/auth/authClient";
import { getEnvConfigClient } from "@/lib/config/env";
import { useAuth } from "@/lib/hooks";
import { APP_ROUTES, APP_ROUTES_CONFIG } from "@/lib/routes/routes";
import { vkCodeResponseSchema } from "@/lib/schemas/vkCodeResponseSchema";
import { Button } from "@shared/ui/components/button";
import {
  StatusCard,
  StatusCardLoading,
  StatusCardTypes,
} from "@shared/ui/components/StatusCard";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export const SignInVkPageContent = () => {
  const isInitialized = useRef(false);
  const { refetch } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const params = useSearchParams();

  const [returnTo, setReturnTo] = useState<string>(
    APP_ROUTES_CONFIG[APP_ROUTES.MODAL_SETTINGS].href
  );

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const storedReturnTo = sessionStorage.getItem("OAUTH_RETURN_TO");
    if (storedReturnTo) setReturnTo(storedReturnTo);

    const codeValidationResult = vkCodeResponseSchema.safeParse(
      Object.fromEntries(params.entries())
    );

    if (!codeValidationResult.success) {
      setErrorMessage("Received unexpected data shape from VK ID");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    initializeModelVk(codeValidationResult.data)
      .then((response) => {
        if (!response.success) {
          setErrorMessage(response.errorMessage);
          return;
        }
        authClient.organization
          .setActive({
            organizationId:
              getEnvConfigClient().NEXT_PUBLIC_DEFAULT_SCOUTING_ORG_ID,
          })
          .then((result) => {
            if (result.error)
              throw new Error("Error while setting active organization.");
            sessionStorage.removeItem("OAUTH_RETURN_TO");
            refetch();
          });
      })
      .catch((error) => {
        setErrorMessage(
          error instanceof Error ? error.message : "Something went wrong."
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <StatusCardLoading />;

  if (errorMessage)
    return (
      <StatusCard
        type={StatusCardTypes.ERROR}
        title={"An error has occured"}
        description={errorMessage}
        className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
      >
        <Button asChild>
          <Link href={returnTo}>{"Go Back"}</Link>
        </Button>
      </StatusCard>
    );

  return (
    <StatusCard
      type={StatusCardTypes.SUCCESS}
      title={"SUCCESS"}
      description={"Sussesfully linked VK ID to your model account."}
      className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
    >
      <Button asChild>
        <Link href={returnTo}>{"Go Back"}</Link>
      </Button>
    </StatusCard>
  );
};
