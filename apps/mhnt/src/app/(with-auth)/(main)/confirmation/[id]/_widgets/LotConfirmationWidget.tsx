"use client";

import { signLotConfirmation } from "@/actions/signLotConfirmation";
import { useAuth } from "@/components/AppProviders/AuthProvider";
import { InfoCard } from "@/components/InfoCard/InfoCard";
import { InterceptedLink } from "@/components/InterceptedLink/InterceptedLink";
import { APP_ROUTES, APP_ROUTES_CONFIG } from "@/lib/routes/routes";
import { formatErrorMessage } from "@/lib/utils/createActionResponse";
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
  const { session } = useAuth();

  const [isPending, startTransition] = useTransition();

  if (!session) {
    <StatusCard
      type={StatusCardTypes.ERROR}
      title="Sign in required"
      className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
    >
      <Suspense>
        <Button asChild size="lg" type="submit" className="w-full">
          <InterceptedLink href={APP_ROUTES_CONFIG[APP_ROUTES.SIGN_IN]}>
            {"Sign in"}
          </InterceptedLink>
        </Button>
      </Suspense>
    </StatusCard>;
  }

  return (
    <InfoCard title={"profile confirmation"}>
      <span>{data.name}</span>
      <span>{data.scouterId}</span>
      <span>{data.email}</span>
      <Button
        disabled={isPending}
        onClick={() => {
          try {
            startTransition(async () => {
              const result = await signLotConfirmation({ lotId: data.id });
              if (!result.success) {
                toast(result.errorMessage);
              } else {
                toast("SUCCESS");
                router.refresh();
              }
            });
          } catch (error) {
            toast(formatErrorMessage(error));
          }
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
