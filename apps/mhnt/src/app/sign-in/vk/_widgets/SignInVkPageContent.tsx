"use client";

import { initializeModelVk } from "@/actions/initializeModelVk";
import { authClient } from "@/lib/auth/authClient";
import { getEnvConfigClient } from "@/lib/config/env";
import { useActiveMember, useAppParams } from "@/lib/hooks";
import { vkCodeResponseSchema } from "@/lib/schemas/vkCodeResponseSchema";
import { toast } from "@shared/ui/components/sonner";
import { StatusCard, StatusCardTypes } from "@shared/ui/components/StatusCard";
import { AppClientError } from "@shared/ui/lib/utils/appClientError";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const SignInVkPageContent = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { entries } = useAppParams();

  const { refetch: refetchActiveMember } = useActiveMember();

  useEffect(() => {
    const returnTo = sessionStorage.getItem("OAUTH_RETURN_PATH") || "/";

    const paramsObject = Object.fromEntries(entries);
    const codeValidationResult = vkCodeResponseSchema.safeParse(paramsObject);

    if (!codeValidationResult.success) {
      setIsLoading(false);
      setErrorMessage("Received unexpected data shape from VK ID");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    initializeModelVk(codeValidationResult.data)
      .then(() => {
        authClient.organization
          .setActive({
            organizationId:
              getEnvConfigClient().NEXT_PUBLIC_DEFAULT_SCOUTING_ORG_ID,
          })
          .then((result) => {
            if (result.error) {
              setErrorMessage(result.error.message || result.error.statusText);
              return;
            }
            sessionStorage.removeItem("OAUTH_RETURN_PATH");
            toast("Success");
            refetchActiveMember();
            router.push(returnTo);
          });
      })
      .catch((error) => {
        if (error instanceof AppClientError) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Unexpected error occurred while processing VK ID.");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (errorMessage)
    return (
      <StatusCard
        type={StatusCardTypes.ERROR}
        title={"An error has occured"}
        description={errorMessage}
        className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
      />
    );

  if (isLoading)
    return (
      <StatusCard
        type={StatusCardTypes.LOADING}
        title={"Loading..."}
        className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
      />
    );

  return (
    <StatusCard
      type={StatusCardTypes.ERROR}
      title={"SUCCESS"}
      description={"Sussessfully linked VK ID to your model account."}
      className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
    />
  );
};
