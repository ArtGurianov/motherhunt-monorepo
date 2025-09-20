"use client";

import { useToastParam } from "@/lib/hooks";
import { Toaster } from "@shared/ui/components/sonner";

export const AppToaster = () => {
  useToastParam();

  return <Toaster position="top-right" />;
};
