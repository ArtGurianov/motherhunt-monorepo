import {
  magicLinkClient,
  adminClient,
  organizationClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import {
  appAdminRole,
  appBookerRole,
  apphHeadBookerRole,
  appModeratorRole,
  appScouterRole,
} from "./permissions";
import { auth } from "./auth";

export const { signIn, signOut, signUp, useSession, organization } =
  createAuthClient({
    plugins: [
      magicLinkClient(),
      adminClient({
        roles: {
          appAdminRole,
          appModeratorRole,
          apphHeadBookerRole,
          appBookerRole,
          appScouterRole,
        },
      }),
      organizationClient(),
      inferAdditionalFields<typeof auth>(),
    ],
    /** The base URL of the server (optional if you're using the same domain) */
    // baseURL: "http://localhost:3000",
  });
