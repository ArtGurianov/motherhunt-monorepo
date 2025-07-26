import { encodePacked } from "viem";

export function stringToBytes32(value: string) {
  const bytes = encodePacked(["string"], [value]);

  return bytes.length > 66
    ? (bytes.slice(0, 66) as `0x${string}`)
    : (`${bytes}${"0".repeat(66 - bytes.length)}` as `0x${string}`);
}
