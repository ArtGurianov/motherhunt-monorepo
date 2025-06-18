import {
  magicLinkClient,
  adminClient,
  organizationClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import {
  appAccessControl,
  agencyAccessControl,
  APP_ROLES_CONFIG,
  AGENCY_ROLES_CONFIG,
} from "./permissions";
import { auth } from "./auth";

export const authClient = createAuthClient({
  plugins: [
    magicLinkClient(),
    adminClient({
      ac: appAccessControl,
      roles: APP_ROLES_CONFIG,
    }),
    organizationClient({
      ac: agencyAccessControl,
      roles: AGENCY_ROLES_CONFIG,
    }),
    inferAdditionalFields<typeof auth>(),
  ],
  /** The base URL of the server (optional if you're using the same domain) */
  // baseURL: "http://localhost:3000",
});
