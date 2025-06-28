"use client";

import { useToastParam } from "@/lib/hooks/useToastParam";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, Suspense, useState } from "react";

const ToastFromParams = () => {
  useToastParam();
  return null;
};

export const AppProviders = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      <Suspense>
        <ToastFromParams />
      </Suspense>
    </>
  );
};
