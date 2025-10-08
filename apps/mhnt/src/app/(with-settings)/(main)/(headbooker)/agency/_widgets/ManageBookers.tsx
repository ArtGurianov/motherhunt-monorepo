"use client";

import { useActiveAgencyBookers } from "@/lib/hooks/useActiveAgencyBookers";
import { ManageBookersContent } from "./ManageBookersContent";
import {
  StatusCard,
  StatusCardLoading,
  StatusCardTypes,
} from "@shared/ui/components/StatusCard";

export const ManageBookers = () => {
  const {
    data: bookersList,
    isLoading,
    isPending,
    error,
  } = useActiveAgencyBookers();

  if (isLoading || isPending) {
    return <StatusCardLoading />;
  }

  if (!bookersList || !!error)
    return (
      <StatusCard
        type={StatusCardTypes.ERROR}
        title="Error while fetching bookers data"
        description={error?.message}
      />
    );

  return <ManageBookersContent bookersList={bookersList} />;
};
