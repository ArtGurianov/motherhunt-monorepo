import { ValueOf } from "@/lib/types";

export const GUIDES_KEYS = {
  INTRO: "INTRO",
  INSTRUCTIONS: "INSTRUCTIONS",
  SNAPS: "SNAPS",
  PLATFORM: "PLATFORM",
} as const;
export type GuideKey = ValueOf<typeof GUIDES_KEYS>;

export const GUIDES_ORDER: GuideKey[] = [
  GUIDES_KEYS.INTRO,
  GUIDES_KEYS.INSTRUCTIONS,
  GUIDES_KEYS.SNAPS,
  GUIDES_KEYS.PLATFORM,
];

export const GUIDES_CONFIG = {
  [GUIDES_KEYS.INTRO]: {
    url: "/guides/introduction",
    bgImageUrl: "/guides/bg-intro.png",
  },
  [GUIDES_KEYS.INSTRUCTIONS]: {
    url: "/guides/instructions",
    bgImageUrl: "/guides/bg-instructions.png",
  },
  [GUIDES_KEYS.SNAPS]: {
    url: "/guides/snaps",
    bgImageUrl: "/guides/bg-snaps.png",
  },
  [GUIDES_KEYS.PLATFORM]: {
    url: "/guides/platform",
    bgImageUrl: "/guides/bg-platform.png",
  },
} as const;
