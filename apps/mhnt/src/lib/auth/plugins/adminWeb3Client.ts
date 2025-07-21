import type { BetterAuthClientPlugin } from "better-auth/client";
import type { adminWeb3Plugin } from "./adminWeb3";

export const adminWeb3Client = () => {
  return {
    id: "admin-web3-plugin",
    $InferServerPlugin: {} as ReturnType<typeof adminWeb3Plugin>,
  } satisfies BetterAuthClientPlugin;
};
