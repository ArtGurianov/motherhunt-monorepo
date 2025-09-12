import { SignedOutGuard } from "@/components/Guards/SignedOutGuard";
import { ReactNode } from "react";

export default function SignInLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <SignedOutGuard>{children}</SignedOutGuard>;
}
