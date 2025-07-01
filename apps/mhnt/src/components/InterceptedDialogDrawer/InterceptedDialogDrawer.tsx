"use client";

import { useCloseIntercepted } from "@/lib/hooks";
import {
  DialogDrawer,
  DialogDrawerProps,
} from "@shared/ui/components/DialogDrawer/DialogDrawer";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowBigLeft } from "lucide-react";
import { Button } from "@shared/ui/components/button";

interface InterceptedDialogDrawerProps
  extends Omit<DialogDrawerProps, "isOpen" | "onClose" | "title" | "backBtn"> {
  targetPath: string;
}

const DIALOG_TITLES_CONFIG: Record<string, string> = {
  "/settings": "User Settings",
  "/settings/agency": "My Agencies",
} as const;

export const InterceptedDialogDrawer = ({
  targetPath,
  children,
  ...rest
}: InterceptedDialogDrawerProps) => {
  const pathname = usePathname();
  const particles = pathname.split("/");
  const { onInterceptedClose } = useCloseIntercepted();

  const [isOpen, setIsOpen] = useState(pathname.startsWith(targetPath));
  useEffect(() => {
    setIsOpen(pathname.startsWith(targetPath));
  }, [pathname]);

  return (
    <DialogDrawer
      title={DIALOG_TITLES_CONFIG[pathname] ?? "Unknown Route"}
      {...rest}
      isOpen={isOpen}
      backBtn={
        particles.length > 2 ? (
          <Button
            asChild
            variant="secondary"
            size="reset"
            className="absolute top-0 left-4 p-px"
          >
            <Link href={particles.slice(0, particles.length - 1).join("/")}>
              <ArrowBigLeft />
            </Link>
          </Button>
        ) : null
      }
      onClose={() => {
        onInterceptedClose();
      }}
    >
      {children}
    </DialogDrawer>
  );
};
