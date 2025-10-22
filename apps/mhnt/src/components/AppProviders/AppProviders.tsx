"use client";

import { QueryClient } from "@tanstack/react-query";
import { ReactNode, Suspense } from "react";
import ProvidersClient from "./ProvidersClient";
import { AppToaster } from "./AppToaster";
import { QueryErrorBoundary } from "@/components/ErrorBoundaries";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000, // 5 minutes
        retry: false,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        refetchOnMount: true,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export const AppProviders = ({ children }: { children: ReactNode }) => {
  const queryClient = getQueryClient();

  return (
    <ProvidersClient queryClient={queryClient}>
      <QueryErrorBoundary>{children}</QueryErrorBoundary>
      <Suspense>
        <AppToaster />
      </Suspense>
    </ProvidersClient>
  );
};
