"use client";

import { processAgencyApplication } from "@/actions/processAgencyApplication";
import { CommentForm } from "@/components/Forms/CommentForm";
import { InfoCard } from "@/components/InfoCard/InfoCard";
import { OrganizationBeforeReviewMetadata } from "@/lib/utils/types";
import { Organization } from "@shared/db";
import { Button } from "@shared/ui/components/button";
import { DialogDrawer } from "@shared/ui/components/DialogDrawer/DialogDrawer";
import { toast } from "@shared/ui/components/sonner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shared/ui/components/table";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface AgenciesApplicationsWidgetProps {
  data: Organization[];
}

export const AgenciesApplicationsWidget = ({
  data,
}: AgenciesApplicationsWidgetProps) => {
  const router = useRouter();
  const [targetDataIndex, setTargetDataIndex] = useState<number | null>(null);
  const t = useTranslations("ADMIN_AGENCY_APPLICATIONS");
  const tToasts = useTranslations("TOASTS");
  const tTitles = useTranslations("INFO_CARD_TITLES");
  const tCommon = useTranslations("COMMON");

  return (
    <div className="flex flex-col gap-12 grow justify-center items-center">
      <InfoCard title={tTitles("applications")}>
        {data.length ? (
          <Table>
            <TableCaption className="text-foreground">
              {t("table-caption")}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">{t("name")}</TableHead>
                <TableHead className="text-center">{t("slug")}</TableHead>
                <TableHead className="text-center">{t("created-at")}</TableHead>
                <TableHead className="text-center">{t("action")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((each, index) => (
                <TableRow key={each.id}>
                  <TableCell className="text-center">{each.name}</TableCell>
                  <TableCell className="text-center">{each.slug}</TableCell>
                  <TableCell className="text-center">
                    {each.createdAt.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="flex gap-1 justify-center items-center">
                    <Button
                      size="reset"
                      className="p-px [&_svg]:size-6"
                      onClick={async () => {
                        const metadata = JSON.parse(
                          each.metadata!
                        ) as OrganizationBeforeReviewMetadata;
                        try {
                          await processAgencyApplication({
                            organizationId: each.id,
                            headBookerEmail: metadata.creatorEmail,
                          });
                          toast(tToasts("approved-message"));
                          router.refresh();
                        } catch (error) {
                          if (error instanceof Error) {
                            toast(error.message);
                          } else {
                            toast(tCommon("unexpected-error"));
                          }
                        }
                      }}
                    >
                      <ThumbsUp />
                    </Button>
                    <span>{"/"}</span>
                    <Button
                      size="reset"
                      className="p-px [&_svg]:size-6"
                      onClick={() => setTargetDataIndex(index)}
                    >
                      <ThumbsDown />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <span className="w-full text-center">{t("no-applications")}</span>
        )}
      </InfoCard>
      <DialogDrawer
        title={t("reject-title")}
        isOpen={typeof targetDataIndex === "number"}
        onClose={() => {
          setTargetDataIndex(null);
        }}
      >
        <CommentForm
          onSubmit={async (value) => {
            if (typeof targetDataIndex === "number") {
              const metadata = JSON.parse(
                data[targetDataIndex]!.metadata!
              ) as OrganizationBeforeReviewMetadata;
              try {
                await processAgencyApplication({
                  organizationId: data[targetDataIndex]!.id,
                  headBookerEmail: metadata.creatorEmail,
                  rejectionReason: value,
                });
                setTargetDataIndex(null);
                toast(tToasts("rejected-message"));
                router.refresh();
              } catch (error) {
                if (error instanceof Error) {
                  toast(error.message);
                } else {
                  toast(tCommon("unexpected-error"));
                }
              }
            }
          }}
        />
      </DialogDrawer>
    </div>
  );
};
