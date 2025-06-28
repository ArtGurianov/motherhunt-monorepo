"use client";

import { useToastParam } from "@/lib/hooks/useToastParam";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export const AppProviders = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());

  useToastParam();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
