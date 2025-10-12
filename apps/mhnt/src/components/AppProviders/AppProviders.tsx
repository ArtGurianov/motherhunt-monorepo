"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";

const ProvidersSSR = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export const AppProviders = ({ children }: { children: ReactNode }) => {
  const [isClientInitialized, setIsClientInitialized] = useState(false);

  useEffect(() => {
    setIsClientInitialized(true);
  }, []);

  const AppQueryProvider = useMemo(() => {
    if (!isClientInitialized) return ProvidersSSR;
    return dynamic(() => import("./ProvidersClient"), {
      ssr: false,
    });
  }, [isClientInitialized]);

  return <AppQueryProvider>{children}</AppQueryProvider>;
};
