import { Chain, createPublicClient, http } from "viem";
import { getAppChain } from "./getAppChain";

export const createViemClient = (chain: Chain) =>
  createPublicClient({
    chain,
    transport: http(),
  });

export const viemClient = createViemClient(getAppChain());
