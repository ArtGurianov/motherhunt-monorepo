import { LotCard } from "@/components/LotCard/LotCard";
import auth from "@/lib/auth/auth";
import { prismaClient } from "@/lib/db";
import { PageSection } from "@shared/ui/components/PageSection";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CreateLotBtn } from "./_widgets/CreateLotBtn";

export default async function DraftsPage() {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });
  if (!session) redirect("/sign-in");

  const myDrafts = await prismaClient.lot.findMany({
    where: { scouterId: session.session.userId },
  });

  return (
    <PageSection
      fullWidth
      className="flex gap-6 flex-wrap justify-center items-center"
    >
      {myDrafts.map((each) => (
        <LotCard
          key={each.id}
          href={`/auction/${each.id}`}
          bgUrl={each.profilePictureUrl}
          alias={each.name || "TEST"}
        />
      ))}
      <CreateLotBtn />
    </PageSection>
  );
}
