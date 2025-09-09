import { encodePacked } from "viem";

export function stringToBytes32(value: string): `0x${string}` {
  const bytes = encodePacked(["string"], [value]);

  const hexWithoutPrefix = bytes.slice(2);

  return hexWithoutPrefix.length > 64
    ? (`0x${hexWithoutPrefix.slice(0, 64)}` as `0x${string}`)
    : (`0x${hexWithoutPrefix.padEnd(64, "0")}` as `0x${string}`);
}
