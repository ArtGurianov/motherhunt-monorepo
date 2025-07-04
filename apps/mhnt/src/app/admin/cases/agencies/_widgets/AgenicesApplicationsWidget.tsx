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

interface AgenciesApplicationsWidgetProps {
  data: Organization[];
}

export const AgenciesApplicationsWidget = ({
  data,
}: AgenciesApplicationsWidgetProps) => {
  const router = useRouter();
  const [targetDataIndex, setTargetDataIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-12 grow justify-center items-center">
      <InfoCard title="applications">
        {data.length ? (
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
                        await processAgencyApplication({
                          organizationId: each.id,
                          headBookerEmail: metadata.creatorEmail,
                        });
                        toast("Approved an agency!");
                        router.refresh();
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
          <span className="w-full text-center">
            {"There are no pending applications."}
          </span>
        )}
      </InfoCard>
      <DialogDrawer
        title="Reject Agency Application"
        isOpen={typeof targetDataIndex === "number"}
        onClose={() => {
          setTargetDataIndex(null);
        }}
      >
        <CommentForm
          onSubmit={async (value) => {
            if (targetDataIndex) {
              const metadata = JSON.parse(
                data[targetDataIndex]!.metadata!
              ) as OrganizationBeforeReviewMetadata;
              await processAgencyApplication({
                organizationId: data[targetDataIndex]!.id,
                headBookerEmail: metadata.creatorEmail,
                rejectionReason: value,
              });
              setTargetDataIndex(null);
              toast("Rejected an agency!");
              router.refresh();
            }
          }}
        />
      </DialogDrawer>
    </div>
  );
};
