"use client";

import { CaptureBtn } from "@/components/CaptureBtn";
import { InfoCard } from "@/components/InfoCard/InfoCard";
import { authClient } from "@/lib/auth/authClient";
import { APP_ROLES } from "@/lib/auth/permissions/app-permissions";
import {
  InlineData,
  InlineDataContent,
  InlineDataLabel,
} from "@shared/ui/components/InlineData";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useTranslations } from "next-intl";
import { useActiveMember } from "@/lib/hooks/useActiveMember";

export const AuthInfo = () => {
  const t = useTranslations("AUTH_INFO");
  const tCommon = useTranslations("COMMON");
  const tTitles = useTranslations("INFO_CARD_TITLES");
  const tRoles = useTranslations("ROLES");

  const {
    isPending: isActiveMemberPending,
    data: activeMember,
    refetch: refetchActiveMember,
  } = useActiveMember();

  const { isPending: isSessionPending, data: session } =
    authClient.useSession();

  if (isSessionPending) return tCommon("loading");
  if (!session) redirect("/sign-in");

  return (
    <InfoCard title={tTitles("account")}>
      <InlineData>
        <InlineDataLabel>{t("logged-in-as")}</InlineDataLabel>
        <InlineDataContent
          sideContent={
            <span className="font-bold text-sm text-green-500">
              {t("active")}
            </span>
          }
        >
          {isActiveMemberPending ? (
            <LoaderCircle className="animate-spin h-6 w-6" />
          ) : (
            tRoles(activeMember ? activeMember.role : session.user.role)
          )}
        </InlineDataContent>
      </InlineData>
      {session.user.role === APP_ROLES.USER_ROLE ? (
        <div className="relative w-full h-10">
          <div className="absolute z-0 top-0 left-1/2 -translate-x-1/2 h-full flex items-center px-1">
            <CaptureBtn shape="horizontal">
              <Link href="/settings/switch-account">{"Switch Account"}</Link>
            </CaptureBtn>
          </div>
        </div>
      ) : null}
    </InfoCard>
  );
};
