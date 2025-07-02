import { getAgencyApplications } from "@/actions/getAgencyApplications";
import { InfoCard } from "@/components/InfoCard/InfoCard";
import { auth } from "@/lib/auth/auth";
import { AgencyApplication } from "@shared/db";
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
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AgenciesApplicationsPage() {
  const headersList = await headers();

  const session = await auth.api.getSession({
    headers: headersList,
  });
  if (!session) {
    redirect("/");
  }

  // const permissionResult = await auth.api.userHasPermission({
  //   headers: headersList,
  //   body: {
  //     userId: session.user.id,
  //     permissions: {
  //       [AGENCY_ENTITIES.AGENCY_ORGANIZATION]: ["create"],
  //       [AGENCY_ENTITIES.AGENCY_HEAD_BOOKER]: ["create"],
  //     },
  //   },
  // });
  // if (!permissionResult.success) {
  //   redirect("/signin");
  // }

  const { data, errorMessage } = await getAgencyApplications({
    type: "pending",
  });

  if (errorMessage)
    return <span>{"An error occured while fetching applications"}</span>;

  return (
    <div className="flex flex-col gap-12 grow justify-center items-center">
      <InfoCard title="switch">
        {data.length ? (
          <Table>
            <TableCaption className="text-foreground">
              {"List of pending applications"}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>{"Name"}</TableHead>
                <TableHead>{"Slug"}</TableHead>
                <TableHead>{"Email"}</TableHead>
                <TableHead>{"Action"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((each: AgencyApplication) => (
                <TableRow key={each.id}>
                  <TableCell>{each.name}</TableCell>
                  <TableCell>{each.slug}</TableCell>
                  <TableCell>{each.applicantEmail}</TableCell>
                  <TableCell className="flex gap-1 justify-center items-center">
                    <Button asChild>{"Approve"}</Button>
                    <span>{"/"}</span>
                    <Button asChild>{"Reject"}</Button>
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
