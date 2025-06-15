import { ROUTER_CONFIG } from "@/config/routing/routerConfig";
import { ValueOf } from "@/lib/types";

export const CONTENTFUL_ENTRY_TYPE_IDS = {
  agency: "agency",
} as const;
export type ContentTypeId = ValueOf<typeof CONTENTFUL_ENTRY_TYPE_IDS>;
export const CONTENT_TYPE_IDS_LIST = Object.values(CONTENTFUL_ENTRY_TYPE_IDS);

export const CONTENTFUL_WEBHOOK_CONFIG: Record<
  ContentTypeId,
  Array<{ path: string; type: "page" | "layout" }>
> = {
  [CONTENTFUL_ENTRY_TYPE_IDS.agency]: [
    {
      path: ROUTER_CONFIG.HOME.routerPath,
      type: "page",
    },
  ],
} as const;
