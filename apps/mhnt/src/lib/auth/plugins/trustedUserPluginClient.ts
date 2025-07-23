import type { BetterAuthClientPlugin } from "better-auth/client";
import type { trustedUserPlugin } from "./trustedUserPlugin";

export const trustedUserPluginClient = () => {
  return {
    id: "trusted-user-plugin",
    $InferServerPlugin: {} as ReturnType<typeof trustedUserPlugin>,
  } satisfies BetterAuthClientPlugin;
};
