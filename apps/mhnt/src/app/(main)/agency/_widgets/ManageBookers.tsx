"use client";

import { DangerousActionDialog } from "@/components/DangerousActionDialog/DangerousActionDialog";
import { BookerInvitationForm } from "@/components/Forms/BookerInvitationForm";
import { InfoCard } from "@/components/InfoCard/InfoCard";
import { authClient } from "@/lib/auth/authClient";
import { AGENCY_ROLES } from "@/lib/auth/permissions/agency-permissions";
import { Button } from "@shared/ui/components/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shared/ui/components/table";
import { Ban, Crown } from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react";

interface ManageBookersProps {
  organizationId: string;
  bookersData: Array<{ role: string; email: string; userId: string }>;
}

export const ManageBookers = ({
  bookersData,
  organizationId,
}: ManageBookersProps) => {
  const [targetActionData, setTargetActionData] = useState<{
    targetId: string;
    action: "revoke" | "transfer";
  } | null>(null);

  const revokeBooker = async () => {
    if (targetActionData) {
      await authClient.organization.removeMember({
        memberIdOrEmail: targetActionData.targetId,
        organizationId,
      });
    }
  };

  const transferHeadBooker = async () => {
    console.log("transfer");
    redirect("/");
  };

  const onActionConfirm = async () => {
    if (!targetActionData) return;
    if (targetActionData.action === "revoke") {
      await revokeBooker();
    }
    if (targetActionData.action === "transfer") {
      await transferHeadBooker();
    }
  };

  return (
    <>
      <InfoCard title={"bookers"} className="w-auto">
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
              {bookersData.map(({ userId, email, role }) => (
                <TableRow key={userId}>
                  <TableCell className="text-center">{email}</TableCell>
                  <TableCell className="text-center">{role}</TableCell>
                  <TableCell>
                    <div className="w-full h-full flex justify-center items-center">
                      <Button
                        disabled={role === AGENCY_ROLES.HEAD_BOOKER_ROLE}
                        size="reset"
                        className="p-px [&_svg]:size-6"
                        onClick={() => {
                          setTargetActionData({
                            action: "revoke",
                            targetId: userId,
                          });
                        }}
                      >
                        <Ban />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="w-full h-full flex justify-center items-center">
                      <Button
                        disabled={role === AGENCY_ROLES.HEAD_BOOKER_ROLE}
                        size="reset"
                        className="p-px [&_svg]:size-6"
                        onClick={() => {
                          setTargetActionData({
                            action: "transfer",
                            targetId: userId,
                          });
                        }}
                      >
                        <Crown />
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
