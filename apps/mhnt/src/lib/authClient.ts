import {
  magicLinkClient,
  adminClient,
  organizationClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import {
  appSuperAdminRole,
  appAdminRole,
  appUserRole,
  agencyHeadBookerRole,
  agencyBookerRole,
  appAccessControl,
  agencyAccessControl,
} from "./permissions";
import { auth } from "./auth";

export const { signIn, signOut, signUp, useSession, organization } =
  createAuthClient({
    plugins: [
      magicLinkClient(),
      adminClient({
        ac: appAccessControl,
        roles: {
          appSuperAdminRole,
          appAdminRole,
          appUserRole,
        },
      }),
      organizationClient({
        ac: agencyAccessControl,
        roles: {
          agencyHeadBookerRole,
          agencyBookerRole,
        },
      }),
      inferAdditionalFields<typeof auth>(),
    ],
    /** The base URL of the server (optional if you're using the same domain) */
    // baseURL: "http://localhost:3000",
  });
