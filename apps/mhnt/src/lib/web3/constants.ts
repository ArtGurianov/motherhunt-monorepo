import { stringToHex } from "viem";

export const ZERO_ADDRESS = stringToHex("", { size: 42 });
export const ZERO_BYTES = stringToHex("", { size: 32 });
