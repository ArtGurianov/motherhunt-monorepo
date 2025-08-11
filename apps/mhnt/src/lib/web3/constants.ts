import { stringToHex } from "viem";

export const ZERO_ADDRESS = stringToHex("", { size: 20 });
export const ZERO_BYTES = stringToHex("", { size: 32 });
