"use client";

import { getEnvConfigClient } from "@/lib/config/env";
import { chain, wagmiAdapter, wagmiConfig } from "@/lib/web3/wagmiConfig";
import { createAppKit } from "@reown/appkit/react";
import { getAppURL } from "@shared/ui/lib/utils";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
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

export default function ProvidersClient({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [persistOptions] = useState(() => ({
    persister: createAsyncStoragePersister({
      storage: window.localStorage,
      key: "REACT_QUERY_OFFLINE_CACHE",
      throttleTime: 1000,
      serialize: JSON.stringify,
      deserialize: JSON.parse,
    }),
  }));

  const [config] = useState(() => wagmiConfig);

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
}
