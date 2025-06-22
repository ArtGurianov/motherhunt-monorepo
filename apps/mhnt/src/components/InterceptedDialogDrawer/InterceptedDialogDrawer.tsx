"use client";

import { useCloseIntercepted } from "@/lib/hooks";
import { DialogDrawer } from "@shared/ui/components/DialogDrawer/DialogDrawer";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

interface InterceptedDialogDrawerProps {
  targetPath: string;
  title: string;
  children: ReactNode;
}

export const InterceptedDialogDrawer = ({
  targetPath,
  title,
  children,
}: InterceptedDialogDrawerProps) => {
  const pathname = usePathname();
  const { onInterceptedClose } = useCloseIntercepted();

  const [isOpen, setIsOpen] = useState(pathname === targetPath);
  useEffect(() => {
    setIsOpen(pathname === targetPath);
  }, [pathname]);

  return (
    <DialogDrawer
      title={title}
      isOpen={isOpen}
      onClose={() => {
        onInterceptedClose();
        setIsOpen(false);
      }}
    >
      {children}
    </DialogDrawer>
  );
};
