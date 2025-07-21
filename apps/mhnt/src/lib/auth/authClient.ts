import {
  adminClient,
  organizationClient,
  inferAdditionalFields,
  magicLinkClient,
  customSessionClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import auth from "./auth";
import {
  APP_ROLES_CONFIG,
  appAccessControl,
} from "@/lib/auth/permissions/app-permissions";
import {
  AGENCY_ROLES_CONFIG,
  agencyAccessControl,
} from "@/lib/auth/permissions/agency-permissions";
import { adminWeb3Client } from "./plugins/adminWeb3Client";

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(),
    customSessionClient<typeof auth>(),
    magicLinkClient(),
    adminWeb3Client(),
    adminClient({
      ac: appAccessControl,
      roles: APP_ROLES_CONFIG,
    }),
    organizationClient({
      ac: agencyAccessControl,
      roles: AGENCY_ROLES_CONFIG,
    }),
  ],
  /** The base URL of the server (optional if you're using the same domain) */
  // baseURL: "http://localhost:3000",
});

export type Session = typeof authClient.$Infer.Session;
