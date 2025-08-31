import { ReactNode } from "react";
import { RouteHeading } from "@/components/RouteHeading/RouteHeading";
import { AuthProvider } from "@/components/AppProviders/AuthProvider";

export default function MainLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <AuthProvider>
      <RouteHeading />
      {children}
    </AuthProvider>
  );
}
