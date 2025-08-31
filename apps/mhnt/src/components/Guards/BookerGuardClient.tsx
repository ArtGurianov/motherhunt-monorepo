"use client";

import { StatusCard, StatusCardTypes } from "@shared/ui/components/StatusCard";
import { ReactNode } from "react";
import { useAuth } from "../AppProviders/AuthProvider";
import { useTranslations } from "next-intl";

interface BookerGuardClientProps {
  children: ReactNode;
  bookersUserIds: string[];
}

export const BookerGuardClient = ({
  children,
  bookersUserIds,
}: BookerGuardClientProps) => {
  const { session } = useAuth();

  const tToasts = useTranslations("TOASTS");

  if (!bookersUserIds.includes(session.userId)) {
    return (
      <StatusCard
        type={StatusCardTypes.ERROR}
        title={tToasts("ACCESS_DENIED")}
        description={"You are not a booker of this agency"}
        className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
      />
    );
  }

  return children;
};
