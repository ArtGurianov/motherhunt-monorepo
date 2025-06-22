"use client";

import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth/authClient";
import { Button } from "@shared/ui/components/button";
import { ChevronsLeft, LoaderCircle, MenuIcon, UserCog } from "lucide-react";
import { cn } from "@shared/ui/lib/utils";
import { InterceptedLink } from "@/components/InterceptedLink/InterceptedLink";
import Link from "next/link";
import { useState } from "react";

export const Navbar = () => {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const [isOpened, setIsOpened] = useState(true);

  if (pathname === "/signin") return null;

  const displayContent = session ? (
    <div className="flex flex-col items-center">
      <span className="text-md text-center text-nowrap">
        {"Currently logged in as:"}
      </span>
      <span className="flex gap-4 justify-center items-center">
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
        <Button
          asChild
          size="reset"
          variant="secondary"
          className="p-1 [&_svg]:pointer-events-auto [&_svg]:size-6"
        >
          <InterceptedLink href="/settings">
            <UserCog />
          </InterceptedLink>
        </Button>
      </span>
    </div>
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
    <nav
      className={cn(
        "h-nav fixed bottom-4 left-1/2 -translate-x-1/2 transition-all duration-700 ease-in-out",
        {
          "-translate-x-full left-0": !isOpened,
        }
      )}
    >
      <div className="relative h-full">
        <div
          className={cn(
            "h-full flex bg-secondary/40 border rounded-full overflow-clip opacity-100 transition-all duration-700 ease-in-out",
            {
              "opacity-0": !isOpened,
            }
          )}
        >
          <div
            className={cn(
              "flex h-full px-4 lg:px-6 justify-center items-center gap-4 bg-linear-to-bl from-main/100 to-main/80",
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
            <div className="flex h-full min-w-16 justify-center items-center">
              <Button
                size="reset"
                variant="ghost"
                className="md:hidden [&_svg]:pointer-events-auto [&_svg]:size-8"
              >
                <MenuIcon />
              </Button>
            </div>
          ) : null}
        </div>
        <Button
          size="reset"
          variant="ghost"
          className="absolute top-1/2 -translate-y-1/2 -right-2 translate-x-full p-1 [&_svg]:pointer-events-auto [&_svg]:size-10"
          onClick={() => setIsOpened((prev) => !prev)}
        >
          <ChevronsLeft
            className={cn("", {
              "rotate-180": !isOpened,
            })}
          />
        </Button>
      </div>
    </nav>
  );
};
