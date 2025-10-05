import "server-only";

import { headers } from "next/headers";
import auth from "../auth";
import { OrgAction, OrgEntity, OrgRole } from "./org-permissions";
import { AppAction, AppEntity } from "./app-permissions";
import { CustomMemberRole, getCustomMemberRole } from "../customRoles";
import { OrgType } from "@/lib/utils/types";
import { getSession } from "@/data/session/getSession";

export type CanAccessAppRoleReturnType =
  | {
      canAccess: true;
      userId: string;
      userEmail: string;
    }
  | { canAccess: false };

export type CanAccessCustomRoleReturnType =
  | {
      canAccess: true;
      userId: string;
      userEmail: string;
      organizationId: string;
      memberId: string;
    }
  | { canAccess: false };

export const canAccessCustomRole = async <TEntity extends OrgEntity>(
  entity: TEntity,
  action: OrgAction<TEntity>,
  allowedCustomRoles: CustomMemberRole[]
): Promise<CanAccessCustomRoleReturnType> => {
  try {
    const headersList = await headers();
    const session = await getSession();

    const {
      activeOrganizationId,
      activeMemberId,
      activeOrganizationType,
      activeOrganizationRole,
    } = session.session;

    const { id: userId, email: userEmail } = session.user;

    if (
      !activeOrganizationId ||
      !activeMemberId ||
      !activeOrganizationType ||
      !activeOrganizationRole
    )
      return { canAccess: false };

    const customRole = getCustomMemberRole(
      activeOrganizationType as OrgType,
      activeOrganizationRole as OrgRole
    );

    if (!allowedCustomRoles.includes(customRole)) return { canAccess: false };

    const result = await auth.api.hasPermission({
      headers: headersList,
      body: {
        organizationId: activeOrganizationId,
        permissions: {
          [entity]: [action],
        },
      },
    });
    return result.success
      ? {
          canAccess: true,
          userId,
          userEmail,
          organizationId: activeOrganizationId,
          memberId: activeMemberId,
        }
      : { canAccess: false };
  } catch {
    return { canAccess: false };
  }
};

export const canAccessAppRole = async <TEntity extends AppEntity>(
  entity: TEntity,
  action: AppAction<TEntity>
): Promise<CanAccessAppRoleReturnType> => {
  try {
    const session = await getSession();

    const result = await auth.api.userHasPermission({
      body: {
        userId: session.user.id,
        permissions: {
          [entity]: [action],
        },
      },
    });
    return result.success
      ? {
          canAccess: true,
          userId: session.user.id,
          userEmail: session.user.email,
        }
      : {
          canAccess: false,
        };
  } catch {
    return { canAccess: false };
  }
};
