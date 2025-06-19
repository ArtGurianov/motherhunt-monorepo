import { BetterAuthClientPlugin } from "better-auth";
import type { magicLink } from ".";

export const magicLinkClient = () => {
  return {
    id: "magic-link",
    $InferServerPlugin: {} as ReturnType<typeof magicLink>,
  } satisfies BetterAuthClientPlugin;
};
