import { SettingsModalManager } from "@/components/SettingsModalManager/SettingsModalManager";
import { ReactNode } from "react";

export default function WithSettingsLayout({
  children,
  modal,
}: Readonly<{ children: ReactNode; modal: React.ReactNode }>) {
  return (
    <>
      {children}
      <SettingsModalManager>{modal}</SettingsModalManager>
    </>
  );
}
