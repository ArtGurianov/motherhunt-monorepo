import { createPublicClient, http } from "viem";
import { AppChain } from "./networkConfig";
import { getAppChain } from "./getAppChain";

export const createViemClient = (chain: AppChain) =>
  createPublicClient({
    chain,
    transport: http(),
  });

export const viemClient = createViemClient(getAppChain());
