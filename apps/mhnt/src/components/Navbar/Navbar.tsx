"use client";

import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth/authClient";
import { Button } from "@shared/ui/components/button";
import { LoaderCircle, UserCog } from "lucide-react";
import { cn } from "@shared/ui/lib/utils";
import { useState } from "react";
import { DialogDrawer } from "@shared/ui/components/DialogDrawer/DialogDrawer";
import Link from "next/link";

export const Navbar = () => {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const [isSettingsOpen, setIsSettingOpen] = useState(false);

  if (pathname === "/signin") return null;

  const displayContent = session ? (
    <>
      <div className="flex flex-col items-center">
        <span className="text-md text-center">{"Currently logged in as:"}</span>
        <Button
          variant="ghost"
          size="reset"
          className="text-2xl text-center font-mono underline"
          onClick={() => setIsSettingOpen(true)}
        >
          {session?.session.activeOrganizationId
            ? session?.session.activeOrganizationRole
            : "SCOUTER"}
        </Button>
      </div>
      <Button
        size="reset"
        variant="secondary"
        className="p-1 [&_svg]:pointer-events-auto [&_svg]:size-8"
        onClick={() => setIsSettingOpen(true)}
      >
        <UserCog />
      </Button>
    </>
  ) : (
    <>
      <span className="text-xl text-center font-mono">{"Logged out"}</span>
      <Button asChild size="lg" variant="secondary">
        <Link href={"/signin"}>{"Sign In"}</Link>
      </Button>
      <span className="text-xl text-center font-mono">{"to continue"}</span>
    </>
  );

  return (
    <>
      <nav className="h-nav flex border bg-secondary/40 rounded-full overflow-clip fixed bottom-4 left-1/2 -translate-x-1/2">
        <div
          className={cn(
            "flex h-full px-6 lg:px-8 justify-center items-center gap-4 bg-linear-to-bl from-main/100 to-main/80",
            { "border-r": !!session }
          )}
        >
          {isPending ? (
            <LoaderCircle className="py-1 animate-spin h-8 w-8" />
          ) : (
            displayContent
          )}
        </div>
        {session ? (
          <div className="h-full min-w-16 bg-white">{/* elements */}</div>
        ) : null}
      </nav>
      <DialogDrawer
        title={"Auth Details"}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingOpen(false)}
      >
        {"hey"}
      </DialogDrawer>
    </>
  );
};
