import { getEnvConfigClient } from "../config/env";
import { NETWORK_NAMES_MAP } from "../web3/networkConfig";

export function getAppChain() {
  const clientConfig = getEnvConfigClient();
  switch (clientConfig.NODE_ENV) {
    case "development":
      return NETWORK_NAMES_MAP.FOUNDRY;
    case "test":
      return NETWORK_NAMES_MAP.FOUNDRY;
    case "production":
      return clientConfig.NEXT_PUBLIC_NETWORK === "mainnet"
        ? NETWORK_NAMES_MAP.MAINNET
        : NETWORK_NAMES_MAP.TESTNET;
    default:
      return NETWORK_NAMES_MAP.FOUNDRY;
  }
}
