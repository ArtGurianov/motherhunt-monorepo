import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { getAppChain } from "./getAppChain";
import { getEnvConfigClient } from "../config/env";

export const chain = getAppChain();

export const wagmiAdapter = new WagmiAdapter({
  ssr: true,
  projectId: getEnvConfigClient().NEXT_PUBLIC_REOWN_PROJECT_ID,
  networks: [chain],
});

export const wagmiConfig = wagmiAdapter.wagmiConfig;
