"use client";

import { InfoCard } from "@/components/InfoCard/InfoCard";
import { authClient } from "@/lib/auth/authClient";
import { OrganizationAfterReviewMetadata } from "@/lib/utils/types";
import { Organization } from "@shared/db";
import { Button } from "@shared/ui/components/button";
import { DialogDrawer } from "@shared/ui/components/DialogDrawer/DialogDrawer";
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
import { useState } from "react";

export const AgenciesApplicationsWidget = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [targetId, setTargetId] = useState<string | null>(null);

  const { data: organizations, isPending } = authClient.useListOrganizations();
  if (isPending) return <span>{"loading..."}</span>;

  return (
    <div className="flex flex-col gap-12 grow justify-center items-center">
      <InfoCard title="applications">
        {organizations?.length ? (
          <Table>
            <TableCaption className="text-foreground">
              {"List of pending applications"}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">{"Name"}</TableHead>
                <TableHead className="text-center">{"Slug"}</TableHead>
                <TableHead className="text-center">{"Created At"}</TableHead>
                <TableHead className="text-center">{"Action"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organizations.map((each) => {
                const metadata = JSON.stringify(
                  each
                ) as unknown as OrganizationAfterReviewMetadata;
                return !metadata.reviewerId ? (
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
                      <Button size="reset" className="p-px [&_svg]:size-6">
                        <ThumbsUp />
                      </Button>
                      <span>{"/"}</span>
                      <Button size="reset" className="p-px [&_svg]:size-6">
                        <ThumbsDown />
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : null;
              })}
            </TableBody>
          </Table>
        ) : (
          <span className="w-full text-center">
            {"There are no pending applications."}
          </span>
        )}
      </InfoCard>
      <DialogDrawer
        title="New Agency Request"
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
        }}
      >
        <div></div>
      </DialogDrawer>
    </div>
  );
};
