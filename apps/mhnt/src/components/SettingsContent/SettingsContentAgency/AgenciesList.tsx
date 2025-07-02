"use client";

import { InfoCard } from "@/components/InfoCard/InfoCard";
import { authClient } from "@/lib/auth/authClient";
import { LoaderCircle, LogIn } from "lucide-react";
import { redirect } from "next/navigation";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shared/ui/components/table";
import { CaptureBtn } from "@/components/CaptureBtn";
import Link from "next/link";

export const AgenciesList = () => {
  const { isPending: isSessionPending, data: sessionData } =
    authClient.useSession();
  if (isSessionPending) return "loading...";
  if (!sessionData) redirect("/signin");

  const { data: organizations, isPending: isOrganizationsPending } =
    authClient.useListOrganizations();
  // const { data: activeOrganization } = authClient.useActiveOrganization();

  // const setActiveOrganization = async (organizationId: string) => {
  //   await authClient.organization.setActive({
  //     organizationId: organizationId,
  //   });
  // };

  return (
    <InfoCard title="switch">
      {isOrganizationsPending ? (
        <span className="w-full flex justify-center items-center">
          <LoaderCircle className="animate-spin h-8 w-8" />
        </span>
      ) : organizations?.length ? (
        <Table>
          <TableCaption className="text-foreground">
            {"A list of your organizations."}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>{"Name"}</TableHead>
              <TableHead>{"Enter"}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {organizations.map((each) => (
              <TableRow key={each.id}>
                <TableCell>{each.name}</TableCell>
                <TableCell>
                  <CaptureBtn asChild>
                    <Link href={`/settings/switch/agency/${each.slug}`}>
                      <LogIn className="h-12 w-12" />
                    </Link>
                  </CaptureBtn>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <span className="w-full text-center">
          {"You have no membership records."}
        </span>
      )}
    </InfoCard>
  );
};
