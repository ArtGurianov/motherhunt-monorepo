import { ValueOf } from "@shared/ui/lib/types";
import { bsc, Chain, foundry, sepolia } from "@reown/appkit/networks";

export const APP_NETWORKS = {
  FOUNDRY: "FOUNDRY",
  TESTNET: "TESTNET",
  MAINNET: "MAINNET",
} as const;
export type AppNetwork = ValueOf<typeof APP_NETWORKS>;

export const NETWORK_NAMES_MAP: Record<AppNetwork, Chain> = {
  [APP_NETWORKS.FOUNDRY]: foundry,
  [APP_NETWORKS.TESTNET]: sepolia,
  [APP_NETWORKS.MAINNET]: bsc,
} as const;
