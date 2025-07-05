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
import { useState } from "react";
import { toast } from "@shared/ui/components/sonner";

export const AgenciesList = () => {
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const { data: organizationsData, isPending: isOrganizationsPending } =
    authClient.useListOrganizations();

  const {
    isPending: isActiveMemberPending,
    data: activeMember,
    refetch: refetchActiveMember,
  } = authClient.useActiveMember();

  const displayOrganizations = organizationsData?.reduce((temp, next) => {
    const { status } = getAgencyApplicationStatus(next as Organization);
    if (status === APPLICATION_STATUSES.APPROVED) {
      temp.push(next as Organization);
    }
    return temp;
  }, [] as Organization[]);

  return (
    <InfoCard title="switch">
      {isOrganizationsPending ? (
        <span className="w-full flex justify-center items-center">
          <LoaderCircle className="animate-spin h-8 w-8" />
        </span>
      ) : displayOrganizations?.length ? (
        <Table>
          <TableCaption className="text-foreground">
            {"A list of your organizations."}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3 text-center">{"Name"}</TableHead>
              <TableHead className="w-1/3 text-center">{"Slug"}</TableHead>
              <TableHead className="w-1/3 text-center">{"Enter"}</TableHead>
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
                        isAuthLoading ||
                        activeMember?.organizationId === each.id
                      }
                      size="reset"
                      className="p-px [&_svg]:size-6"
                      onClick={async () => {
                        setIsAuthLoading(true);
                        try {
                          await authClient.organization.setActive({
                            organizationId: each.id,
                          });
                          refetchActiveMember();
                          toast("Switched to agency");
                        } catch {}
                        setIsAuthLoading(false);
                      }}
                    >
                      {isAuthLoading || isActiveMemberPending ? (
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
        <span className="w-full text-center">
          {"You have no membership records."}
        </span>
      )}
    </InfoCard>
  );
};
