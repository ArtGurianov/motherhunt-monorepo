"use server";

import { prismaClient } from "@/lib/db";
import { getAppLocale, getAppURL } from "@shared/ui/lib/utils";
import { sendEmail } from "./sendEmail";
import { APIError } from "@/lib/auth/apiError";
import { getTranslations } from "next-intl/server";
import { viemClient } from "@/lib/web3/viemClient";
import { canProcessAgencyApplication } from "@/lib/auth/permissions/checkers";
import { revalidatePath } from "next/cache";

const locale = getAppLocale();

export const rejectAgencyApplication = async ({
  address,
  signature,
  organizationId,
  rejectionReason,
  headBookerEmail,
}: {
  address: string;
  signature: string;
  organizationId: string;
  rejectionReason: string;
  headBookerEmail: string;
}) => {
  const canAccess = await canProcessAgencyApplication();
  if (!canAccess) throw new APIError("FORBIDDEN", { message: "Access Denied" });

  const isValidSignature = await viemClient.verifyMessage({
    address: address as `0x${string}`,
    message: "Reject agency application",
    signature: signature as `0x${string}`,
  });
  if (!isValidSignature)
    throw new APIError("FORBIDDEN", {
      message: "Invalid signature",
    });

  await prismaClient.organization.update({
    where: { id: organizationId },
    data: {
      metadata: JSON.stringify({
        reviewerAddress: address,
        rejectionReason,
      }),
    },
  });

  const t = await getTranslations({ locale, namespace: "EMAIL" });

  await sendEmail({
    to: headBookerEmail,
    subject: t("agency-rejected-subject"),
    meta: {
      description: t("agency-rejected-description"),
      link: `${getAppURL(locale)}/sign-in`,
    },
  });

  revalidatePath("/admin/cases/agencies");
  revalidatePath("/@modal/(.)settings/agency/requests");
  revalidatePath("/@modal/settings/agency/requests");
};
