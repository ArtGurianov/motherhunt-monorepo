import { prismaClient } from "@/lib/db";
import { StatusCard, StatusCardTypes } from "@shared/ui/components/StatusCard";
import { DraftContent } from "./_widgets/DraftContent";
import { Suspense } from "react";

export async function generateStaticParams() {
  const itemsPerFetch = 100;

  const totalItemsCount = await prismaClient.lot.count();
  const iterations = Math.ceil(totalItemsCount / itemsPerFetch);

  const resultData: Array<{ id: string }> = [];

  for (let iteration = 0; iteration < iterations; iteration++) {
    const iterationResult = await prismaClient.lot.findMany({
      skip: iteration * itemsPerFetch,
      take: itemsPerFetch,
      select: { id: true },
    });

    resultData.push(...iterationResult);
  }

  return resultData;
}

interface DraftPageProps {
  params: Promise<{ id: string }>;
}

async function SuspendedPageContent({ params }: DraftPageProps) {
  const { id } = await params;

  const draftData = await prismaClient.lot.findUnique({ where: { id } });
  if (!draftData)
    return <StatusCard type={StatusCardTypes.ERROR} title="Lot not found" />;

  return <DraftContent draftData={draftData} />;
}

export default function DraftPage({ params }: DraftPageProps) {
  return (
    <Suspense>
      <SuspendedPageContent params={params} />
    </Suspense>
  );
}
