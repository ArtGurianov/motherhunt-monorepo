"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth/authClient";
import { Button } from "@shared/ui/components/button";
import {
  ChevronsLeft,
  LoaderCircle,
  LogIn,
  MenuIcon,
  UserCog,
} from "lucide-react";
import { cn } from "@shared/ui/lib/utils";
import { InterceptedLink } from "@/components/InterceptedLink/InterceptedLink";
import { Suspense, useState } from "react";

export const Navbar = () => {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const [isOpened, setIsOpened] = useState(true);

  if (pathname === "/signin") return null;

  const displayRole = session?.session.activeOrganizationId
    ? session.session.activeOrganizationRole
    : session?.user.role;

  const displayContent = session ? (
    <div className="flex flex-col items-center">
      <span className="text-md text-center text-nowrap">
        {"Currently logged in as:"}
      </span>
      <span className="flex gap-4 justify-center items-center">
        <Suspense fallback={"loading..."}>
          <Button
            asChild
            variant="ghost"
            size="reset"
            className="text-2xl text-center font-mono underline"
          >
            <InterceptedLink href="/settings">{displayRole}</InterceptedLink>
          </Button>
        </Suspense>
        <Suspense fallback={"loading..."}>
          <Button
            asChild
            size="reset"
            variant="secondary"
            className="p-px [&_svg]:pointer-events-auto [&_svg]:size-6"
          >
            <InterceptedLink href="/settings">
              <UserCog />
            </InterceptedLink>
          </Button>
        </Suspense>
      </span>
    </div>
  ) : (
    <div className="flex flex-col items-center">
      <span className="text-md text-center text-nowrap">
        {"You are currently"}
      </span>
      <span className="flex gap-4 justify-center items-center">
        <Button
          asChild
          variant="ghost"
          size="reset"
          className="text-2xl text-center font-mono underline"
        >
          <Link href="/settings" className="text-nowrap">
            {"LOGGED OUT"}
          </Link>
        </Button>
        <Button
          asChild
          size="reset"
          variant="secondary"
          className="p-px [&_svg]:pointer-events-auto [&_svg]:size-6"
        >
          <Link href={"/signin"}>
            <LogIn />
          </Link>
        </Button>
      </span>
    </div>
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
            "h-full flex bg-secondary/40 border rounded-2xl overflow-clip opacity-100 transition-all duration-700 ease-in-out",
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
          className={cn(
            "absolute top-1/2 -translate-y-1/2 -right-px sm:-right-2 translate-x-full [&_svg]:pointer-events-auto [&_svg]:size-10",
            { "-right-4": !isOpened }
          )}
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
