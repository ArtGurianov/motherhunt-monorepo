"use client";

import { authClient } from "@/lib/auth/authClient";
import { LoaderCircle } from "lucide-react";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

interface AuthGuardProps {
  children: ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isPending, data } = authClient.useSession();

  if (isPending) return <LoaderCircle className="py-4 animate-spin h-8 w-8" />;
  if (!data) redirect("/signin");
  return children;
};
