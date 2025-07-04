"use client";

import { InfoCard } from "@/components/InfoCard/InfoCard";
import { authClient } from "@/lib/auth/authClient";
import { OrganizationAfterReviewMetadata } from "@/lib/utils/types";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shared/ui/components/table";

export const MyAgencyRequestsWidget = () => {
  const { data: organizations, isPending } = authClient.useListOrganizations();
  if (isPending) return <span>{"loading..."}</span>;

  return (
    <div className="flex flex-col gap-12 grow justify-center items-center">
      <InfoCard title="switch">
        {organizations?.length ? (
          <Table>
            <TableCaption className="text-foreground">
              {"A list of your requests"}
            </TableCaption>
            <TableHeader>
              <TableRow className="bg-accent-foreground/30">
                <TableHead className="w-1/3 text-center">{"Name"}</TableHead>
                <TableHead className="w-1/3 text-center">{"Slug"}</TableHead>
                <TableHead className="w-1/3 text-center">{"Status"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organizations.map((each) => {
                const metadata = JSON.stringify(
                  each.metadata
                ) as unknown as OrganizationAfterReviewMetadata;
                return (
                  <TableRow key={each.id}>
                    <TableCell className="w-1/3 text-center">
                      {each.name}
                    </TableCell>
                    <TableCell className="w-1/3 text-center">
                      {each.slug}
                    </TableCell>
                    <TableCell className="w-1/3 text-center">
                      {metadata.rejectionReason ? "rejected" : "pending"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <span className="w-full text-center">
            {"There are no requests for agency creation."}
          </span>
        )}
      </InfoCard>
    </div>
  );
};
