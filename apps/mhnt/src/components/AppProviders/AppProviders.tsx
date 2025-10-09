"use client";

import { getEnvConfigClient } from "@/lib/config/env";
import { chain, wagmiAdapter, wagmiConfig } from "@/lib/web3/wagmiConfig";
import { createAppKit } from "@reown/appkit/react";
import { getAppURL } from "@shared/ui/lib/utils";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { ReactNode, useState } from "react";
import { WagmiProvider } from "wagmi";

const metadata = {
  name: "motherhunt",
  description: "A web3 marketplace for fashion street scouting.",
  url: getAppURL(),
  icons: ["https://www.mhnt.app/mhnt-logo.png"],
};

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

export const AppProviders = ({ children }: { children: ReactNode }) => {
  const [config] = useState(() => wagmiConfig);
  const [queryClient] = useState(() => new QueryClient());
  const [persistOptions] = useState(() =>
    typeof window === "undefined"
      ? undefined
      : {
          persister: createAsyncStoragePersister({
            storage: localStorage,
            key: "REACT_QUERY_OFFLINE_CACHE",
            throttleTime: 1000,
            serialize: JSON.stringify,
            deserialize: JSON.parse,
          }),
        }
  );

  return (
    <WagmiProvider config={config}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={persistOptions}
      >
        {children}
      </PersistQueryClientProvider>
    </WagmiProvider>
  );
};
