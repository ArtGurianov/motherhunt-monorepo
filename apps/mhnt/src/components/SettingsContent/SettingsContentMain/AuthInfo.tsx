"use client";

import { CaptureBtn } from "@/components/CaptureBtn";
import { InfoCard } from "@/components/InfoCard/InfoCard";
import { APP_ROLES } from "@/lib/auth/permissions/app-permissions";
import {
  InlineData,
  InlineDataContent,
  InlineDataLabel,
} from "@shared/ui/components/InlineData";
import { useTranslations } from "next-intl";
import { APP_ROUTES, APP_ROUTES_CONFIG } from "@/lib/routes/routes";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { generateUpdatedPathString } from "@/lib/utils/generateUpdatedPathString";
import { useAuthenticated } from "@/lib/hooks";

export const AuthInfo = () => {
  const params = useSearchParams();
  const { user, activeMember } = useAuthenticated();

  const t = useTranslations("AUTH_INFO");
  const tTitles = useTranslations("INFO_CARD_TITLES");
  const tRoles = useTranslations("ROLES");

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
          {tRoles(activeMember ? activeMember.role : user.role)}
        </InlineDataContent>
      </InlineData>
      {user.role === APP_ROLES.USER_ROLE ? (
        <div className="relative w-full h-10">
          <div className="absolute z-0 top-0 left-1/2 -translate-x-1/2 h-full flex items-center px-1">
            <CaptureBtn shape="horizontal">
              <Link
                href={generateUpdatedPathString(
                  APP_ROUTES_CONFIG[APP_ROUTES.MODAL_SWITCH].href,
                  params,
                )}
              >
                {"Switch Account"}
              </Link>
            </CaptureBtn>
          </div>
        </div>
      ) : null}
    </InfoCard>
  );
};
