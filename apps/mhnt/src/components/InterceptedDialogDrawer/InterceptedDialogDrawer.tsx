"use client";

import { useCloseIntercepted } from "@/lib/hooks";
import {
  DialogDrawer,
  DialogDrawerProps,
} from "@shared/ui/components/DialogDrawer/DialogDrawer";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface InterceptedDialogDrawerProps
  extends Omit<DialogDrawerProps, "isOpen" | "onClose" | "title"> {
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
      onClose={() => {
        onInterceptedClose();
      }}
    >
      {children}
    </DialogDrawer>
  );
};
