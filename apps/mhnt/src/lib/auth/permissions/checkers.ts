"use server";

import { headers } from "next/headers";
import auth from "../auth";
import { AGENCY_ROLES } from "./agency-permissions";
import { APP_ROLES } from "./app-permissions";

export type CanAccessReturnType = {
  canAccess: boolean;
  data?: string;
};

export const canViewSuperAdmin = async (): Promise<CanAccessReturnType> => {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });
    if (!session) return { canAccess: false };

    const result = await auth.api.userHasPermission({
      body: {
        userId: session.user.id,
        permissions: {
          [APP_ROLES.SUPER_ADMIN_ROLE]: ["view"],
        },
      },
    });

    return { canAccess: result.success };
  } catch {
    return { canAccess: false };
  }
};

export const canViewAdmin = async (): Promise<CanAccessReturnType> => {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });
    if (!session) return { canAccess: false };

    const result = await auth.api.userHasPermission({
      body: {
        userId: session.user.id,
        permissions: {
          [APP_ROLES.ADMIN_ROLE]: ["view"],
        },
      },
    });
    return { canAccess: result.success };
  } catch {
    return { canAccess: false };
  }
};

export const canViewScouter = async (): Promise<CanAccessReturnType> => {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });
    if (!session) return { canAccess: false };

    const result = await auth.api.userHasPermission({
      body: {
        userId: session.user.id,
        permissions: {
          [APP_ROLES.SCOUTER_ROLE]: ["view"],
        },
      },
    });
    return { canAccess: result.success };
  } catch {
    return { canAccess: false };
  }
};

export const canViewHeadBooker = async (): Promise<CanAccessReturnType> => {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });
    if (!session?.session.activeOrganizationId) return { canAccess: false };

    const result = await auth.api.hasPermission({
      headers: headersList,
      body: {
        organizationId: session.session.activeOrganizationId,
        permissions: {
          [AGENCY_ROLES.HEAD_BOOKER_ROLE]: ["view"],
        },
      },
    });
    return {
      canAccess: result.success,
      data: session.session.activeOrganizationId,
    };
  } catch {
    return { canAccess: false };
  }
};
