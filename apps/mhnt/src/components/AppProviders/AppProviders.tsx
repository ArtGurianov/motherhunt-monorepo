"use client";

import { QueryClient } from "@tanstack/react-query";
import { ReactNode, Suspense } from "react";
import ProvidersClient from "./ProvidersClient";
import { AppToaster } from "./AppToaster";
import { AppGlobalActions } from "./AppGlobalActions";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000, // 5 minutes
        retry: false,
        refetchOnWindowFocus: false, // Don't refetch when window regains focus
        refetchOnReconnect: false, // Don't refetch on reconnect
        refetchOnMount: false, // Don't refetch when component mounts if data exists
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
      {children}
      <Suspense>
        <AppToaster />
        <AppGlobalActions />
      </Suspense>
    </ProvidersClient>
  );
};
