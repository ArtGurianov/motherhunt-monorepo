import { ReactNode } from "react";
import { RouteHeading } from "@/components/RouteHeading/RouteHeading";
import { SignedInGuardClient } from "@/components/Guards/SignedInGuardClient";

export default function MainLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <SignedInGuardClient>
      <RouteHeading />
      {children}
    </SignedInGuardClient>
  );
}
