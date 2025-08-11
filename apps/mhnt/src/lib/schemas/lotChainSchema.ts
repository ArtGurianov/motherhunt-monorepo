import { ValueOf } from "@shared/ui/lib/types";
import { z } from "zod";

export const LOT_STATUSES = {
  VOTING: "VOTING",
  ACTIVE: "ACTIVE",
  CANCELED: "CANCELED",
  SETTLING: "SETTLING",
  APPEALED: "APPEALED",
  FULFILLED: "FULFILLED",
} as const;
export type LotStatus = ValueOf<typeof LOT_STATUSES>;

const MAP_CHAIN_LOT_STATUS: Record<number, LotStatus> = {
  0: LOT_STATUSES.VOTING,
  1: LOT_STATUSES.ACTIVE,
  2: LOT_STATUSES.CANCELED,
  3: LOT_STATUSES.SETTLING,
  4: LOT_STATUSES.APPEALED,
  5: LOT_STATUSES.FULFILLED,
};

export const lotChainSchema = z
  .object({
    scouterId: z.string(),
    votingDetails: z.object({
      communityVotesPositive: z.array(z.string()),
      communityVotesNegative: z.array(z.string()),
      adminDecisionPositive: z.string(),
      adminDecisionNegative: z.string(),
    }),
    status: z.number(),
    minimumPriceUSD: z.bigint(),
    immediatePriceUSD: z.bigint(),
    appealableTill: z.bigint(),
  })
  .transform((data) => ({
    ...data,
    status: MAP_CHAIN_LOT_STATUS[data.status],
    minimumPriceUSD: Number(data.minimumPriceUSD),
    immediatePriceUSD: Number(data.immediatePriceUSD),
    appealableTill: Number(data.appealableTill),
  }));
