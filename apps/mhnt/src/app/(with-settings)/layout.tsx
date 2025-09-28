import { SettingsModalManager } from "@/components/SettingsModalManager/SettingsModalManager";
import { StatusCardLoading } from "@shared/ui/components/StatusCard";
import { ReactNode, Suspense } from "react";

export default function WithSettingsLayout({
  children,
  modal,
}: Readonly<{ children: ReactNode; modal: React.ReactNode }>) {
  return (
    <Suspense fallback={<StatusCardLoading />}>
      {children}
      <SettingsModalManager>{modal}</SettingsModalManager>
    </Suspense>
  );
}
