import { AuthGuard } from "@/components/Guards/AuthGuard";
import { RouteManager } from "./_routeManager";

export default function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RouteManager>
      <AuthGuard>{children}</AuthGuard>
    </RouteManager>
  );
}
