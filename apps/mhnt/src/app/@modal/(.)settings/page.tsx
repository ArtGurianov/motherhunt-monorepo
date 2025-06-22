"use client";

import { useCloseIntercepted } from "@/lib/hooks";
import { DialogDrawer } from "@shared/ui/components/DialogDrawer/DialogDrawer";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const pathname = usePathname();
  const { onInterceptedClose } = useCloseIntercepted();

  const [isOpen, setIsOpen] = useState(pathname === "/settings");
  useEffect(() => {
    setIsOpen(pathname === "/settings");
  }, [pathname]);

  return (
    <DialogDrawer
      title={"Auth Details"}
      isOpen={isOpen}
      onClose={() => {
        onInterceptedClose();
        setIsOpen(false);
      }}
    >
      {"Auth Details"}
    </DialogDrawer>
  );
}
