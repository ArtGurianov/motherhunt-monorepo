"use client";

import { InfoCard } from "@/components/InfoCard/InfoCard";
import { authClient } from "@/lib/auth/authClient";
import { getAgencyApplicationStatus } from "@/lib/utils/getAgencyApplicationStatus";
import { ORG_TYPES, OrgMetadata } from "@/lib/utils/types";
import { Organization } from "@shared/db";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shared/ui/components/table";
import { TooltipPopover } from "@shared/ui/components/TooltipPopover";
import { AlertCircleIcon, LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export const MyAgencyRequestsWidget = () => {
  const { data: organizations, isPending } = authClient.useListOrganizations();
  const t = useTranslations("MY_AGENCY_REQUESTS");
  const tTitles = useTranslations("INFO_CARD_TITLES");
  const tStatuses = useTranslations("APPLICATION_STATUSES");

  return (
    <InfoCard title={tTitles("requests")}>
      {isPending ? (
        <LoaderCircle className="animate-spin h-12 w-12" />
      ) : (
        <>
          {organizations?.length ? (
            <Table>
              <TableCaption className="text-foreground">
                {t("table-caption")}
              </TableCaption>
              <TableHeader>
                <TableRow className="bg-accent-foreground/30">
                  <TableHead className="w-1/3 text-center">
                    {t("name")}
                  </TableHead>
                  <TableHead className="w-1/3 text-center">
                    {t("slug")}
                  </TableHead>
                  <TableHead className="w-1/3 text-center">
                    {t("status")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {organizations.map((each) => {
                  const metadata = JSON.parse(each.metadata) as OrgMetadata;
                  if (metadata.orgType !== ORG_TYPES.AGENCY) return null;

                  const { status, rejectionReason } =
                    getAgencyApplicationStatus(each as Organization);
                  return (
                    <TableRow key={each.id}>
                      <TableCell className="w-1/3 text-center">
                        {each.name}
                      </TableCell>
                      <TableCell className="w-1/3 text-center">
                        {each.slug}
                      </TableCell>
                      <TableCell className="w-1/3">
                        <div className="w-full flex justify-center items-center gap-2">
                          <span>{tStatuses(status)}</span>
                          {rejectionReason ? (
                            <TooltipPopover content={rejectionReason}>
                              {
                                <AlertCircleIcon
                                  size={18}
                                  className="text-red-700"
                                />
                              }
                            </TooltipPopover>
                          ) : null}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <span className="w-full text-center">{t("no-requests")}</span>
          )}
        </>
      )}
    </InfoCard>
  );
};
