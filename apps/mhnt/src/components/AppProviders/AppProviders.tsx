"use client";

import { getEnvConfigClient } from "@/lib/config/env";
import { useToastParam } from "@/lib/hooks";
import { chain, wagmiAdapter, wagmiConfig } from "@/lib/web3/wagmiConfig";
import { createAppKit } from "@reown/appkit/react";
import { getAppURL } from "@shared/ui/lib/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, Suspense, useState } from "react";
import { State, WagmiProvider } from "wagmi";

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

const ToastFromParams = () => {
  useToastParam();
  return null;
};

export const AppProviders = ({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: State;
}) => {
  const [config] = useState(() => wagmiConfig);
  const [queryClient] = useState(() => new QueryClient());

  return (
    <>
      <WagmiProvider config={config} initialState={initialState}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
        <Suspense>
          <ToastFromParams />
        </Suspense>
      </WagmiProvider>
    </>
  );
};
