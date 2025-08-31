import { AuthProvider } from "@/components/AppProviders/AuthProvider";
import { ReactNode } from "react";

export default function SettingsModalLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <AuthProvider>{children}</AuthProvider>;
}
