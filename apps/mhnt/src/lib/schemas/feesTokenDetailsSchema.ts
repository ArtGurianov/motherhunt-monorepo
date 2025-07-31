import { z } from "zod";

export const feesTokenDetailsSchema = z.object({
  tokenAddress: z.string(),
  decimals: z.number(),
  symbol: z.string(),
  name: z.string(),
  minClaimableUnitsAmount: z.bigint(),
});
