import { magicLinkClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
export const { signIn, signUp, useSession } = createAuthClient({
  plugins: [magicLinkClient()],
  /** The base URL of the server (optional if you're using the same domain) */
  // baseURL: "http://localhost:3000",
});
