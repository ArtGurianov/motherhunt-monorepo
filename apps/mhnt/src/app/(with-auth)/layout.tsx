import { AuthProvider } from "@/components/AppProviders/AuthProvider";
import { SettingsModalManager } from "@/components/SettingsModalManager/SettingsModalManager";
import { ReactNode } from "react";

export default function WithAuthLayout({
  children,
  modal,
}: Readonly<{ children: ReactNode; modal: React.ReactNode }>) {
  return (
    <AuthProvider>
      {children}
      <SettingsModalManager>{modal}</SettingsModalManager>
    </AuthProvider>
  );
}
