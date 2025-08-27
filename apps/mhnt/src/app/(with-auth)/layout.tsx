import { AuthProvider } from "@/components/AppProviders/AuthProvider";
import { ReactNode } from "react";

export default function WithAuthLayout({
  children,
  modal,
}: Readonly<{ children: ReactNode; modal: React.ReactNode }>) {
  return (
    <AuthProvider>
      {children}
      {modal}
    </AuthProvider>
  );
}
