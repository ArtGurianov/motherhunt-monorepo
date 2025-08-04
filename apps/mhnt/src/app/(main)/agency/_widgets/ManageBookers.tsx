"use client";

import { deleteBookerRole } from "@/actions/deleteBooker";
import { transferHeadBookerRole } from "@/actions/transferHeadBookerRole";
import { DangerousActionDialog } from "@/components/DangerousActionDialog/DangerousActionDialog";
import { BookerInvitationForm } from "@/components/Forms/BookerInvitationForm";
import { InfoCard } from "@/components/InfoCard/InfoCard";
import { AGENCY_ROLES } from "@/lib/auth/permissions/agency-permissions";
import { useActiveMember } from "@/lib/hooks/useActiveMember";
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
import { useState, useTransition } from "react";

interface ManageBookersProps {
  bookersData: Array<{ role: string; email: string; memberId: string }>;
}

export const ManageBookers = ({ bookersData }: ManageBookersProps) => {
  const router = useRouter();
  const { refetch } = useActiveMember();
  const [isPending, startTransition] = useTransition();

  const [targetActionData, setTargetActionData] = useState<{
    targetId: string;
    action: "revoke" | "transfer";
  } | null>(null);

  const onActionConfirm = () => {
    if (!targetActionData) return;
    startTransition(async () => {
      if (targetActionData.action === "revoke") {
        const result = await deleteBookerRole(targetActionData.targetId);
        if (result.errorMessage) {
          toast(result.errorMessage);
        } else {
          toast("SUCCESS");
          refetch();
          router.refresh();
        }
      }
      if (targetActionData.action === "transfer") {
        const result = await transferHeadBookerRole(targetActionData.targetId);
        if (result.errorMessage) {
          toast(result.errorMessage);
        } else {
          toast("SUCCESS");
          refetch();
          router.refresh();
        }
      }
    });
  };

  return (
    <>
      <InfoCard title={"bookers"}>
        {bookersData.length ? (
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
              {bookersData.map(({ memberId, email, role }) => (
                <TableRow key={memberId}>
                  <TableCell className="text-center">{email}</TableCell>
                  <TableCell className="text-center">{role}</TableCell>
                  <TableCell>
                    <div className="w-full h-full flex justify-center items-center">
                      <Button
                        disabled={
                          role === AGENCY_ROLES.HEAD_BOOKER_ROLE || isPending
                        }
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
                        disabled={
                          role === AGENCY_ROLES.HEAD_BOOKER_ROLE || isPending
                        }
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
        ) : (
          <span className="w-full text-center">{"No bookers found"}</span>
        )}
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
