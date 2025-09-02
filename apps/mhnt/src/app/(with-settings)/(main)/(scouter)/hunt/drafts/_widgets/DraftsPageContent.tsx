"use client";

import { CreateLotBtn } from "@/components/ActionButtons/CreateLotBtn";
import { LotCard } from "@/components/LotCard/LotCard";
import { useMyDrafts } from "@/lib/hooks/useMyDrafts";
import { APP_ROUTES, APP_ROUTES_CONFIG } from "@/lib/routes/routes";
import { buildDynamicRoutePath } from "@/lib/utils/buildDynamicRoutePath";
import { PageSection } from "@shared/ui/components/PageSection";
import { StatusCard, StatusCardTypes } from "@shared/ui/components/StatusCard";

export const DraftsPageContent = () => {
  const { data: result, isPending, isLoading, error, refetch } = useMyDrafts();

  if (isPending || isLoading)
    return (
      <StatusCard
        type={StatusCardTypes.LOADING}
        title={"Loading..."}
        className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
      />
    );

  if (error) {
    return (
      <StatusCard
        type={StatusCardTypes.ERROR}
        title={"Error while fetching data"}
        description={error.message}
        className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
      />
    );
  }

  if (!result.success) {
    return (
      <StatusCard
        type={StatusCardTypes.ERROR}
        title={"Error while fetching data"}
        description={result.errorMessage}
        className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
      />
    );
  }

  return (
    <PageSection
      fullWidth
      className="flex gap-6 flex-wrap justify-center items-center"
    >
      {result.data.map((each) => (
        <LotCard
          key={each.id}
          href={buildDynamicRoutePath(
            APP_ROUTES_CONFIG[APP_ROUTES.DRAFT].href,
            {
              id: each.id,
            }
          )}
          bgUrl={each.profilePictureUrl}
          alias={each.name || "Draft"}
        />
      ))}
      <CreateLotBtn onSuccess={refetch} />
    </PageSection>
  );
};
