"use client";

import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth/authClient";
import { Button } from "@shared/ui/components/button";
import { LoaderCircle, UserCog } from "lucide-react";
import { cn } from "@shared/ui/lib/utils";
import { InterceptedLink } from "@/components/InterceptedLink/InterceptedLink";
import Link from "next/link";

export const Navbar = () => {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  if (pathname === "/signin") return null;

  const displayContent = session ? (
    <>
      <div className="flex flex-col items-center">
        <span className="text-md text-center text-nowrap">
          {"Currently logged in as:"}
        </span>
        <Button
          asChild
          variant="ghost"
          size="reset"
          className="text-2xl text-center font-mono underline"
        >
          <InterceptedLink href="/settings">
            {session?.session.activeOrganizationId
              ? session?.session.activeOrganizationRole
              : "SCOUTER"}
          </InterceptedLink>
        </Button>
      </div>
      <Button
        asChild
        size="reset"
        variant="secondary"
        className="p-1 [&_svg]:pointer-events-auto [&_svg]:size-8"
      >
        <InterceptedLink href="/settings">
          <UserCog />
        </InterceptedLink>
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
      {session ? <div className="h-full min-w-16">{/* elements */}</div> : null}
    </nav>
  );
};
