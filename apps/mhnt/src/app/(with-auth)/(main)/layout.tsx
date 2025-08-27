import { ReactNode } from "react";
import { RouteHeading } from "@/components/RouteHeading/RouteHeading";

export default function MainLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <RouteHeading />
      {children}
    </>
  );
}
