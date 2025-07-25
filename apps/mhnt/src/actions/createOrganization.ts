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

export const createOrganization = async ({
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

    const userOrganizations = await prismaClient.member.findMany({
      where: { userId: session.user.id },
    });
    for (const each of userOrganizations) {
      const organizationData = await prismaClient.organization.findFirst({
        where: { id: each.organizationId },
      });
      if (
        !!organizationData?.metadata &&
        !JSON.parse(organizationData.metadata).reviewerAddress
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
          applicantEmail: session.user.email,
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
