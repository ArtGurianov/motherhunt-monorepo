import { prismaClient } from "@/lib/db";
import { StatusCard, StatusCardTypes } from "@shared/ui/components/StatusCard";
import { LotContent } from "./_widgets/LotContent";

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

interface LotPageProps {
  params: Promise<{ id: string }>;
}

export default async function LotPage(props: LotPageProps) {
  const { id } = await props.params;

  const lotData = await prismaClient.lot.findUnique({ where: { id } });
  if (!lotData)
    return <StatusCard type={StatusCardTypes.ERROR} title="Lot not found" />;

  return <LotContent lotData={lotData} />;
}
