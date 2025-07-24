"use client";

import { rejectAgencyApplication } from "@/actions/rejectAgencyApplication";
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
import { LoaderCircle, ThumbsDown, ThumbsUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useAccount, useSignMessage } from "wagmi";
import { useAppWriteContract } from "@/lib/hooks/useAppWriteContract";
import { systemContractAbi } from "@/lib/web3/abi";
import { getEnvConfigClient } from "@/lib/config/env";
import { acceptAgencyApplication } from "@/actions/acceptAgencyApplication";
import { stringToBytes32 } from "@/lib/utils/stringToBytes32";

interface AgenciesApplicationsWidgetProps {
  data: Organization[];
}

export const AgenciesApplicationsWidget = ({
  data,
}: AgenciesApplicationsWidgetProps) => {
  const router = useRouter();
  const [isTransitionPending, startTransition] = useTransition();
  const [rejectionTarget, setRejectionTarget] = useState<{
    targetIndex: number;
    rejectionReason?: string;
  } | null>(null);
  const t = useTranslations("ADMIN_AGENCY_APPLICATIONS");
  const tToasts = useTranslations("TOASTS");
  const tTitles = useTranslations("INFO_CARD_TITLES");
  const tCommon = useTranslations("COMMON");

  const { address } = useAccount();

  const {
    data: signature,
    signMessage,
    error: signatureError,
    isPending: isSignaturePending,
    isIdle: isSignatureIdle,
  } = useSignMessage();

  useEffect(() => {
    if (signatureError) toast("Signature error.");
  }, [signatureError]);

  useEffect(() => {
    if (signature && address && rejectionTarget?.rejectionReason) {
      const targetData = data[rejectionTarget.targetIndex]!;
      const metadata = JSON.parse(
        targetData.metadata!
      ) as OrganizationBeforeReviewMetadata;

      startTransition(async () => {
        try {
          await rejectAgencyApplication({
            address,
            signature,
            organizationId: targetData.id,
            headBookerEmail: metadata.creatorEmail,
            rejectionReason: rejectionTarget.rejectionReason!,
          });
          toast(tToasts("rejected-message"));
          setRejectionTarget(null);
          router.refresh();
        } catch (error) {
          if (error instanceof Error) {
            toast(error.message);
          } else {
            toast(tCommon("unexpected-error"));
          }
        }
      });
    }
  }, [signature, address, rejectionTarget]);

  const { writeContract, isProcessing } = useAppWriteContract({
    onSuccess: (receipt) => {
      startTransition(async () => {
        try {
          await acceptAgencyApplication(receipt.transactionHash);
          toast(tToasts("approved-message"));
          router.refresh();
        } catch (error) {
          if (error instanceof Error) {
            toast(error.message);
          } else {
            toast(tCommon("unexpected-error"));
          }
        }
      });
    },
  });

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
                      disabled={
                        isTransitionPending ||
                        (isSignaturePending && !isSignatureIdle)
                      }
                      size="reset"
                      className="p-px [&_svg]:size-6"
                      onClick={() => {
                        writeContract({
                          abi: systemContractAbi,
                          address: getEnvConfigClient()
                            .NEXT_PUBLIC_SYSTEM_CONTRACT_ADDRESS as `0x${string}`,
                          functionName: "whitelistAgency",
                          args: [stringToBytes32(each.id)],
                        });
                      }}
                    >
                      {isProcessing ||
                      isTransitionPending ||
                      (isSignaturePending && !isSignatureIdle) ? (
                        <LoaderCircle className="py-1 animate-spin h-8 w-8" />
                      ) : (
                        <ThumbsUp />
                      )}
                    </Button>
                    <span>{"/"}</span>
                    <Button
                      disabled={
                        isProcessing ||
                        isTransitionPending ||
                        (isSignaturePending && !isSignatureIdle)
                      }
                      size="reset"
                      className="p-px [&_svg]:size-6"
                      onClick={() => {
                        setRejectionTarget({
                          targetIndex: index,
                        });
                      }}
                    >
                      {isProcessing ||
                      isTransitionPending ||
                      (isSignaturePending && !isSignatureIdle) ? (
                        <LoaderCircle className="py-1 animate-spin h-8 w-8" />
                      ) : (
                        <ThumbsDown />
                      )}
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
        isOpen={typeof rejectionTarget?.targetIndex === "number"}
        onClose={() => {
          setRejectionTarget(null);
        }}
      >
        <CommentForm
          onSubmit={(value) => {
            setRejectionTarget((prev) => ({
              targetIndex: prev!.targetIndex,
              rejectionReason: value,
            }));
            signMessage({ message: "Reject agency application" });
          }}
        />
      </DialogDrawer>
    </div>
  );
};
