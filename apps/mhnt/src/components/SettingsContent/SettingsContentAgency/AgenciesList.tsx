"use client";

import { InfoCard } from "@/components/InfoCard/InfoCard";
import { authClient } from "@/lib/auth/authClient";
import { Check, LoaderCircle, LogIn } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shared/ui/components/table";
import { Button } from "@shared/ui/components/button";
import {
  APPLICATION_STATUSES,
  getAgencyApplicationStatus,
} from "@/lib/utils/getAgencyApplicationStatus";
import { Organization } from "@shared/db";
import { useTransition } from "react";
import { toast } from "@shared/ui/components/sonner";
import { useTranslations } from "next-intl";
import { formatErrorMessage } from "@/lib/utils/createActionResponse";
import { useAuth } from "@/components/AppProviders/AuthProvider";

export const AgenciesList = () => {
  const { refetch, activeMember } = useAuth();

  const [isPending, startTransition] = useTransition();
  const t = useTranslations("AGENCIES_LIST");
  const tTitles = useTranslations("INFO_CARD_TITLES");
  const tToasts = useTranslations("TOASTS");

  const { data: organizationsData, isPending: isOrganizationsPending } =
    authClient.useListOrganizations();

  const displayOrganizations = organizationsData?.reduce((temp, next) => {
    const { status } = getAgencyApplicationStatus(next as Organization);
    if (status === APPLICATION_STATUSES.APPROVED) {
      temp.push(next as Organization);
    }
    return temp;
  }, [] as Organization[]);

  return (
    <InfoCard title={tTitles("switch")}>
      {isOrganizationsPending ? (
        <span className="w-full flex justify-center items-center">
          <LoaderCircle className="animate-spin h-8 w-8" />
        </span>
      ) : displayOrganizations?.length ? (
        <Table>
          <TableCaption className="text-foreground">
            {t("table-caption")}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3 text-center">{t("name")}</TableHead>
              <TableHead className="w-1/3 text-center">{t("slug")}</TableHead>
              <TableHead className="w-1/3 text-center">{t("enter")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayOrganizations.map((each) => (
              <TableRow key={each.id}>
                <TableCell className="w-1/3 text-center">{each.name}</TableCell>
                <TableCell className="w-1/3 text-center">{each.slug}</TableCell>
                <TableCell className="w-1/3">
                  <div className="h-full w-full flex justify-center items-center">
                    <Button
                      disabled={
                        isPending || activeMember?.organizationId === each.id
                      }
                      size="reset"
                      className="p-px [&_svg]:size-6"
                      onClick={() => {
                        startTransition(async () => {
                          try {
                            await authClient.organization.setActive({
                              organizationId: each.id,
                            });
                            refetch();
                            toast(tToasts("switched-to-agency"));
                          } catch (error) {
                            toast(formatErrorMessage(error));
                          }
                        });
                      }}
                    >
                      {isPending ? (
                        <LoaderCircle className="animate-spin" />
                      ) : activeMember?.organizationId === each.id ? (
                        <Check />
                      ) : (
                        <LogIn />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <span className="w-full text-center">{t("no-membership")}</span>
      )}
    </InfoCard>
  );
};
