"use client";

import { getEnvConfigClient } from "@/lib/config/env";
import { chain, wagmiAdapter, wagmiConfig } from "@/lib/web3/wagmiConfig";
import { createAppKit } from "@reown/appkit/react";
import { getAppURL } from "@shared/ui/lib/utils";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { ReactNode, useState, useEffect } from "react";
import { WagmiProvider } from "wagmi";

const metadata = {
  name: "motherhunt",
  description: "A web3 marketplace for fashion street scouting.",
  url: getAppURL(),
  icons: ["https://www.mhnt.app/mhnt-logo.png"],
};

let appKitInitialized = false;

export default function ProvidersClient({
  children,
  queryClient,
}: {
  children: ReactNode;
  queryClient: QueryClient;
}) {
  const [config] = useState(() => wagmiConfig);

  useEffect(() => {
    if (typeof window !== "undefined" && !appKitInitialized) {
      appKitInitialized = true;

      // Suppress console errors from Coinbase Wallet SDK COOP checks
      const originalConsoleError = console.error;
      console.error = (...args: unknown[]) => {
        // Filter out COOP-related errors that occur on 404 pages
        const errorMessage = args[0]?.toString() || "";
        if (
          errorMessage.includes("Cross-Origin-Opener-Policy") ||
          errorMessage.includes("404")
        ) {
          // Silently ignore these errors as they're expected on 404 pages
          return;
        }
        originalConsoleError(...args);
      };

      try {
        createAppKit({
          adapters: [wagmiAdapter],
          projectId: getEnvConfigClient().NEXT_PUBLIC_REOWN_PROJECT_ID,
          networks: [chain],
          defaultNetwork: chain,
          metadata: metadata,
          features: {
            analytics: true,
          },
          enableNetworkSwitch: true,
        });
      } catch (error) {
        // Handle any initialization errors gracefully
        originalConsoleError("Failed to initialize AppKit:", error);
      } finally {
        // Restore original console.error after a short delay
        // to allow SDK initialization to complete
        setTimeout(() => {
          console.error = originalConsoleError;
        }, 2000);
      }
    }
  }, []);

  const [persistOptions] = useState(() => {
    if (typeof window === "undefined") {
      return null;
    }
    return {
      persister: createAsyncStoragePersister({
        storage: window.localStorage,
        key: "REACT_QUERY_OFFLINE_CACHE",
        throttleTime: 1000,
        serialize: JSON.stringify,
        deserialize: JSON.parse,
      }),
    };
  });

  return (
    <WagmiProvider config={config}>
      {persistOptions ? (
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={persistOptions}
        >
          {children}
        </PersistQueryClientProvider>
      ) : (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      )}
    </WagmiProvider>
  );
}
