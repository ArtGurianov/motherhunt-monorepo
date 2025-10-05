"use server";

import auth from "@/lib/auth/auth";
import { APIError } from "better-auth/api";
import { prismaClient } from "@/lib/db";
import { getSession } from "@/data/session/getSession";
import { revalidatePath } from "next/cache";
import { sendEmail } from "./sendEmail";
import { getTranslations } from "next-intl/server";
import { getAppLocale, getAppURL } from "@shared/ui/lib/utils";
import { AppBusinessError } from "@/lib/utils/errorUtils";
import { createActionResponse } from "@/lib/utils/createActionResponse";
import { ORG_TYPES, OrgMetadata } from "@/lib/utils/types";
import { ORG_ROLES } from "@/lib/auth/permissions/org-permissions";
import { APP_ROUTES, APP_ROUTES_CONFIG } from "@/lib/routes/routes";

export const createNewAgencyOrg = async ({
  name,
  slug,
}: {
  name: string;
  slug: string;
}) => {
  try {
    const session = await getSession();
    if (!session)
      throw new APIError("UNAUTHORIZED", { message: "Unauthorized" });

    const ownedOrgs = await prismaClient.member.findMany({
      where: { userId: session.user.id, role: ORG_ROLES.OWNER_ROLE },
    });
    for (const each of ownedOrgs) {
      const organizationData = await prismaClient.organization.findUnique({
        where: {
          id: each.organizationId,
        },
      });
      if (!organizationData?.metadata)
        throw new AppBusinessError(
          "Could not get data for one of your organizations",
          400
        );
      const metadata: OrgMetadata = JSON.parse(
        organizationData.metadata
      ) as OrgMetadata;
      if (metadata.orgType === "AGENCY" && !metadata.reviewerAddress) {
        throw new AppBusinessError(
          "Your previous request is still pending",
          400
        );
      }
    }

    await auth.api.createOrganization({
      body: {
        name,
        slug,
        logo: "",
        metadata: {
          creatorUserId: session.user.id,
          orgType: ORG_TYPES.AGENCY,
        },
        userId: session.user.id,
        keepCurrentOrganization: true,
      },
    });

    const locale = getAppLocale();
    const t = await getTranslations({ locale, namespace: "EMAIL" });

    await sendEmail({
      to: session.user.email,
      subject: t("org-setup-subject"),
      meta: {
        description: t("org-setup-description"),
        link: `${getAppURL(locale)}/sign-in`,
      },
    });

    revalidatePath(APP_ROUTES_CONFIG[APP_ROUTES.AGENCIES_APPLICATIONS].href);
    revalidatePath(
      APP_ROUTES_CONFIG[APP_ROUTES.MODAL_SWITCH_AGENCY_REQUESTS].href
    );

    return createActionResponse();
  } catch (error) {
    return createActionResponse({ error });
  }
};
