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

  if (isPending)
    return (
      <div className="flex w-full h-full justify-center items-center">
        <LoaderCircle className="animate-spin h-12 w-12" />
      </div>
    );
  if (!data) redirect("/sign-in");
  return children;
};
