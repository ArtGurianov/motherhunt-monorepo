"use client";

import { signOut } from "@/lib/authClient";
import { Button } from "@shared/ui/components/button";
import { useRouter } from "next/navigation";

export const SignOutBtn = () => {
  const router = useRouter();

  return (
    <Button
      onClick={() =>
        signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push("/signin"); // redirect to login page
            },
          },
        })
      }
      className="flex gap-1 text-lg font-light font-mono"
    >
      {"Sign out"}
    </Button>
  );
};
