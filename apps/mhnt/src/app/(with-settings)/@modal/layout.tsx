import { SignedInGuardClient } from "@/components/Guards/SignedInGuardClient";
import { ReactNode } from "react";

export default function SettingsModalLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <SignedInGuardClient>{children}</SignedInGuardClient>;
}
