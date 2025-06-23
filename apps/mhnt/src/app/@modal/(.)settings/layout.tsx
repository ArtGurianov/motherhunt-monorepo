import { RouteManager } from "./_routeManager";

export default function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RouteManager>{children}</RouteManager>;
}
