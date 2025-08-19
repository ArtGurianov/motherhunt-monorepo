"use server";

import { headers } from "next/headers";
import auth from "../auth";
import { ORG_ROLES } from "./org-permissions";
import { APP_ENTITIES, APP_ROLES } from "./app-permissions";

export type CanAccessReturnType = {
  canAccess: boolean;
  userId?: string;
  organizationId?: string;
  memberId?: string;
};

export const canViewDaog = async (): Promise<CanAccessReturnType> => {
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
          [APP_ROLES.MYDAOGS_ADMIN_ROLE]: ["view"],
        },
      },
    });

    return { canAccess: result.success };
  } catch {
    return { canAccess: false };
  }
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
          [APP_ROLES.PROJECT_SUPERADMIN_ROLE]: ["view"],
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
          [APP_ROLES.PROJECT_ADMIN_ROLE]: ["view"],
        },
      },
    });
    return { canAccess: result.success };
  } catch {
    return { canAccess: false };
  }
};

export const canViewUser = async (): Promise<CanAccessReturnType> => {
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
          [APP_ROLES.USER_ROLE]: ["view"],
        },
      },
    });
    return { canAccess: result.success };
  } catch {
    return { canAccess: false };
  }
};

export const canViewOrgOwner = async (): Promise<CanAccessReturnType> => {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });
    if (
      !session?.session.activeOrganizationId ||
      !session?.session.activeMemberId
    )
      return { canAccess: false };

    const result = await auth.api.hasPermission({
      headers: headersList,
      body: {
        organizationId: session.session.activeOrganizationId,
        permissions: {
          [ORG_ROLES.OWNER_ROLE]: ["view"],
        },
      },
    });
    return {
      canAccess: result.success,
      memberId: session.session.activeMemberId,
    };
  } catch {
    return { canAccess: false };
  }
};

export const canTransferAgencyOwnerRole =
  async (): Promise<CanAccessReturnType> => {
    try {
      const headersList = await headers();
      const session = await auth.api.getSession({
        headers: headersList,
      });
      if (
        !session?.session.activeOrganizationId ||
        !session?.session.activeMemberId
      )
        return { canAccess: false };

      const result = await auth.api.hasPermission({
        headers: headersList,
        body: {
          organizationId: session.session.activeOrganizationId,
          permissions: {
            [ORG_ROLES.OWNER_ROLE]: ["transferRole"],
          },
        },
      });
      return {
        canAccess: result.success,
        memberId: session.session.activeMemberId,
      };
    } catch {
      return { canAccess: false };
    }
  };

export const canDeleteOrgMember = async (): Promise<CanAccessReturnType> => {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });
    if (
      !session?.session.activeOrganizationId ||
      !session?.session.activeMemberId
    )
      return { canAccess: false };

    const result = await auth.api.hasPermission({
      headers: headersList,
      body: {
        organizationId: session.session.activeOrganizationId,
        permissions: {
          [ORG_ROLES.MEMBER_ROLE]: ["delete"],
        },
      },
    });
    return {
      canAccess: result.success,
    };
  } catch {
    return { canAccess: false };
  }
};

export const canProcessAgencyApplication =
  async (): Promise<CanAccessReturnType> => {
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
            [APP_ENTITIES.ORGANIZATION]: ["process"],
          },
        },
      });
      return { canAccess: result.success };
    } catch {
      return { canAccess: false };
    }
  };
