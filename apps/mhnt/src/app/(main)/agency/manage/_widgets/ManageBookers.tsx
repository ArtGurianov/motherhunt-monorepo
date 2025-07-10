"use client";

import { InfoCard } from "@/components/InfoCard/InfoCard";
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

interface ManageBookersProps {
  organizationId: string;
  bookersData: Array<{ role: string; email: string; userId: string }>;
}

export const ManageBookers = ({ bookersData }: ManageBookersProps) => {
  return (
    <div className="flex flex-col gap-12 grow justify-center items-center">
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
                        onClick={async () => {}}
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
                        onClick={async () => {}}
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
      </InfoCard>
      {/* <DialogDrawer
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
      </DialogDrawer> */}
    </div>
  );
};
