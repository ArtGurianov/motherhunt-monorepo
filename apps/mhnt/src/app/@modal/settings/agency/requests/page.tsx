import { getAgencyApplications } from "@/actions/getAgencyApplications";
import { InfoCard } from "@/components/InfoCard/InfoCard";
import { auth } from "@/lib/auth/auth";
import { AgencyApplication } from "@shared/db";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shared/ui/components/table";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function MyAgencyRequestsPage() {
  const headersList = await headers();

  const session = await auth.api.getSession({
    headers: headersList,
  });
  if (!session) {
    redirect("/");
  }

  const { data, errorMessage } = await getAgencyApplications({
    applicantId: session.user.id,
    type: "all",
  });

  if (errorMessage)
    return <span>{"An error occured while fetching applications"}</span>;

  return (
    <div className="flex flex-col gap-12 grow justify-center items-center">
      <InfoCard title="switch">
        {data.length ? (
          <Table>
            <TableCaption className="text-foreground">
              {"A list of your pending requests"}
            </TableCaption>
            <TableHeader>
              <TableRow className="bg-accent-foreground/30">
                <TableHead className="w-1/3 text-center">{"Name"}</TableHead>
                <TableHead className="w-1/3 text-center">{"Slug"}</TableHead>
                <TableHead className="w-1/3 text-center">{"Status"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((each: AgencyApplication) => (
                <TableRow key={each.id}>
                  <TableCell className="w-1/3 text-center">
                    {each.name}
                  </TableCell>
                  <TableCell className="w-1/3 text-center">
                    {each.slug}
                  </TableCell>
                  <TableCell className="w-1/3 text-center">
                    {each.rejectionReason ? "rejected" : "pending"}
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
    </div>
  );
}
