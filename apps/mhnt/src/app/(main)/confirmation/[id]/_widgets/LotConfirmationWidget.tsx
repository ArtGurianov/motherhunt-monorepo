"use client";

import { signLotConfirmation } from "@/actions/signLotConfirmation";
import { InfoCard } from "@/components/InfoCard/InfoCard";
import { InterceptedLink } from "@/components/InterceptedLink/InterceptedLink";
import { authClient } from "@/lib/auth/authClient";
import { CUSTOM_MEMBER_ROLES } from "@/lib/auth/customRoles";
import { useActiveMember } from "@/lib/hooks";
import { Lot } from "@shared/db";
import { Button } from "@shared/ui/components/button";
import { toast } from "@shared/ui/components/sonner";
import { StatusCard, StatusCardTypes } from "@shared/ui/components/StatusCard";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense, useTransition } from "react";

interface LotConfirmationWidgetProps {
  data: Lot;
}

export const LotConfirmationWidget = ({ data }: LotConfirmationWidgetProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    data: session,
    isPending: isSessionPending,
    error: sessionError,
  } = authClient.useSession();

  const {
    data: activeMember,
    isPending: isActiveMemberPending,
    errorMessage: activeMemberErrorMessage,
  } = useActiveMember();

  if (isSessionPending || isActiveMemberPending)
    return (
      <StatusCard
        type={StatusCardTypes.LOADING}
        title="Loading..."
        className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
      />
    );

  if (sessionError || activeMemberErrorMessage)
    return (
      <StatusCard
        type={StatusCardTypes.ERROR}
        title="Error"
        description={sessionError?.message || activeMemberErrorMessage}
        className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
      />
    );

  if (!session) {
    <StatusCard
      type={StatusCardTypes.ERROR}
      title="Sign in required"
      className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
    >
      <Suspense>
        <Button asChild size="lg" type="submit" className="w-full">
          <InterceptedLink href="/sign-in">{"Sign in"}</InterceptedLink>
        </Button>
      </Suspense>
    </StatusCard>;
  }

  if (activeMember?.role !== CUSTOM_MEMBER_ROLES.MODEL_ROLE) {
    return (
      <StatusCard
        type={StatusCardTypes.ERROR}
        title="Model sign in required"
        description="Please switch account to Model"
        className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
      >
        <Suspense>
          <Button asChild size="lg" type="submit" className="w-full">
            <InterceptedLink href="/settings/switch-account">
              {"Switch account"}
            </InterceptedLink>
          </Button>
        </Suspense>
      </StatusCard>
    );
  }

  return (
    <InfoCard title={"profile confirmation"}>
      <span>{data.name}</span>
      <span>{data.scouterId}</span>
      <span>{data.email}</span>
      <Button
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            const result = await signLotConfirmation({ lotId: data.id });
            if (result.errorMessage) {
              toast(result.errorMessage);
            } else {
              toast("SUCCESS");
              router.refresh();
            }
          });
        }}
      >
        {isPending ? (
          <LoaderCircle className="py-1 animate-spin h-8 w-8" />
        ) : (
          "Agree and Confirm"
        )}
      </Button>
    </InfoCard>
  );
};
