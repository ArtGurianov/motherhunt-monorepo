"use client";

import { deleteBookerRole } from "@/actions/deleteBooker";
import { transferHeadBookerRole } from "@/actions/transferHeadBookerRole";
import { DangerousActionDialog } from "@/components/DangerousActionDialog/DangerousActionDialog";
import { BookerInvitationForm } from "@/components/Forms";
import { InfoCard } from "@/components/InfoCard/InfoCard";
import { ORG_ROLES } from "@/lib/auth/permissions/org-permissions";
import { useActiveMember } from "@/lib/hooks";
import { Button } from "@shared/ui/components/button";
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
import { Ban, Crown, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode, useState, useTransition } from "react";
import { BookersData } from "../page";
import { formatErrorMessage } from "@/lib/utils/createActionResponse";

export const ManageBookers = ({ data: bookersList }: { data: BookersData }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [targetActionData, setTargetActionData] = useState<{
    targetId: string;
    action: "revoke" | "transfer";
  } | null>(null);

  const { refetch } = useActiveMember();

  const onActionConfirm = () => {
    if (!targetActionData) return;
    startTransition(async () => {
      try {
        if (targetActionData.action === "revoke") {
          const result = await deleteBookerRole(targetActionData.targetId);
          if (!result.success) {
            toast(result.errorMessage);
            return;
          }
          toast("SUCCESS");
          router.refresh();
        }
        if (targetActionData.action === "transfer") {
          const result = await transferHeadBookerRole(
            targetActionData.targetId
          );
          if (!result.success) {
            toast(result.errorMessage);
            return;
          }
          toast("SUCCESS");
          refetch();
          router.refresh();
        }
      } catch (error) {
        toast(formatErrorMessage(error));
      }
    });
  };

  let displayData: ReactNode = (
    <span className="w-full text-center">{"No bookers found"}</span>
  );
  if (bookersList) {
    if (!bookersList.length) {
      displayData = (
        <span className="w-full text-center">{"No bookers found"}</span>
      );
    } else {
      displayData = (
        <Table>
          <TableCaption className="text-foreground">
            {"Bookers of your agency"}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">{"email"}</TableHead>
              <TableHead className="text-center">{"role"}</TableHead>
              <TableHead className="text-center">{"revoke"}</TableHead>
              <TableHead className="text-center">{"upgrade"}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookersList.map(({ memberId, email, role }) => (
              <TableRow key={memberId}>
                <TableCell className="text-center">{email}</TableCell>
                <TableCell className="text-center">{role}</TableCell>
                <TableCell>
                  <div className="w-full h-full flex justify-center items-center">
                    <Button
                      disabled={role === ORG_ROLES.OWNER_ROLE || isPending}
                      size="reset"
                      className="p-px [&_svg]:size-6"
                      onClick={() => {
                        setTargetActionData({
                          action: "revoke",
                          targetId: memberId,
                        });
                      }}
                    >
                      {isPending ? (
                        <LoaderCircle className="py-1 animate-spin h-8 w-8" />
                      ) : (
                        <Ban />
                      )}
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="w-full h-full flex justify-center items-center">
                    <Button
                      disabled={role === ORG_ROLES.OWNER_ROLE || isPending}
                      size="reset"
                      className="p-px [&_svg]:size-6"
                      onClick={() => {
                        setTargetActionData({
                          action: "transfer",
                          targetId: memberId,
                        });
                      }}
                    >
                      {isPending ? (
                        <LoaderCircle className="py-1 animate-spin h-8 w-8" />
                      ) : (
                        <Crown />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }
  }

  return (
    <>
      <InfoCard title={"bookers"}>
        {displayData}
        <BookerInvitationForm />
      </InfoCard>
      <DangerousActionDialog
        title={
          targetActionData?.action === "revoke"
            ? "Revoke Booker"
            : "Transfer Role"
        }
        isOpen={!!targetActionData}
        onClose={() => setTargetActionData(null)}
        onActionConfirm={onActionConfirm}
      />
    </>
  );
};
