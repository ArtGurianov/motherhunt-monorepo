"use server";

import auth from "@/lib/auth/auth";
import { APIError } from "better-auth/api";
import { prismaClient } from "@/lib/db";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { sendEmail } from "./sendEmail";
import { getTranslations } from "next-intl/server";
import { getAppLocale, getAppURL } from "@shared/ui/lib/utils";
import { AppClientError } from "@shared/ui/lib/utils/appClientError";
import { createActionResponse } from "@/lib/utils/createActionResponse";
import { ORG_TYPES, OrgMetadata } from "@/lib/utils/types";

export const createNewAgencyOrg = async ({
  name,
  slug,
}: {
  name: string;
  slug: string;
}) => {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });
    if (!session)
      throw new APIError("UNAUTHORIZED", { message: "Unauthorized" });

    const ownedAgencies = await prismaClient.member.findMany({
      where: { userId: session.user.id },
    });
    for (const each of ownedAgencies) {
      const organizationData = await prismaClient.organization.findFirst({
        where: {
          AND: {
            id: each.organizationId,
            metadata: {
              contains: JSON.stringify({ orgType: ORG_TYPES.AGENCY }),
            },
          },
        },
      });
      if (!organizationData?.metadata)
        throw new AppClientError(
          "Could not get data for one of your organizations"
        );
      if (
        !(JSON.parse(organizationData.metadata) as OrgMetadata).reviewerAddress
      ) {
        throw new AppClientError("Your previous request is still pending.");
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

    revalidatePath("/admin/cases/agencies");
    revalidatePath("/@modal/(.)settings/agency/requests");
    revalidatePath("/@modal/settings/agency/requests");

    return createActionResponse();
  } catch (error) {
    return createActionResponse({ error });
  }
};
