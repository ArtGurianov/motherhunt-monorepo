"use server";

import { headers } from "next/headers";
import auth from "../../auth";
import { AGENCY_ROLES } from "../agency-permissions";
import { APP_ROLES } from "../app-permissions";

export const canViewSuperAdmin = async () => {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });
    if (!session) return false;

    const result = await auth.api.userHasPermission({
      body: {
        userId: session.user.id,
        permissions: {
          [APP_ROLES.SUPER_ADMIN_ROLE]: ["view"],
        },
      },
    });

    return result.success;
  } catch {
    return false;
  }
};

export const canViewAdmin = async () => {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });
    if (!session) return false;

    const result = await auth.api.userHasPermission({
      body: {
        userId: session.user.id,
        permissions: {
          [APP_ROLES.ADMIN_ROLE]: ["view"],
        },
      },
    });
    return result.success;
  } catch {
    return false;
  }
};

export const canViewScouter = async () => {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });
    if (!session) return false;

    const result = await auth.api.userHasPermission({
      body: {
        userId: session.user.id,
        permissions: {
          [APP_ROLES.SCOUTER_ROLE]: ["view"],
        },
      },
    });
    return result.success;
  } catch {
    return false;
  }
};

export const canViewHeadBooker = async () => {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });
    if (!session?.session.activeOrganizationId) return false;

    const result = await auth.api.hasPermission({
      headers: headersList,
      body: {
        organizationId: session.session.activeOrganizationId,
        permissions: {
          [AGENCY_ROLES.HEAD_BOOKER_ROLE]: ["view"],
        },
      },
    });
    return result.success;
  } catch {
    return false;
  }
};
