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
