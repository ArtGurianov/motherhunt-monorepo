import { Marquee } from "@/components/Marquee";
import { PageSection } from "@shared/ui/components/PageSection";
import { Button } from "@shared/ui/components/button";
import { getContentfulEntriesByType } from "@/config/contentful/client";
import { DisplayAgencyContentfulSkeleton } from "@/lib/types/contentful";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import { AppClientError } from "@shared/ui/lib/utils/appClientError";

interface DisplayAgencyData {
  name: string;
  url: string;
  logoUrl: string;
}

export const Agencies = async () => {
  const t = await getTranslations("HOME.AGENCIES");
  let agencies: DisplayAgencyData[];

  try {
    const data =
      await getContentfulEntriesByType<DisplayAgencyContentfulSkeleton>(
        "displayAgency"
      );

    agencies = data
      .map((each) => ({
        ...each.fields,
        name: each.fields.name,
        url: each.fields.url,
        logoUrl: each.fields.logo?.fields.file?.url || "",
      }))
      .reverse();
  } catch (error) {
    if (error instanceof AppClientError) {
      throw error;
    }
    throw new AppClientError("Unable to get data from CMS");
  }

  return (
    <PageSection className="relative py-8" fullWidth>
      <h2 className="absolute -rotate-1 -translate-y-1/2 left-0 text-4xl md:text-6xl font-bold font-mono px-4 text-foreground/90">
        {t("title")}
      </h2>
      <div className="relative overflow-clip">
        <span className="absolute -rotate-1 -translate-y-1/2 left-0 z-50 text-4xl md:text-6xl font-bold font-mono px-4 text-accent-foreground">
          {t("title")}
        </span>
        <Marquee>
          <div className="bg-primary bg-[linear-gradient(to_right,var(--accent-foreground),transparent_1px),linear-gradient(to_bottom,var(--accent-foreground),transparent_1px)] bg-[size:70px_70px] py-2">
            <div className="flex flex-col justify-start items-center border-background border-y-12 border-dashed py-2">
              <div className="flex gap-12 pl-12">
                {agencies.map((agency) => (
                  <Button
                    asChild
                    variant="ghost"
                    size="reset"
                    key={agency.name}
                    className="h-48 w-64 relative shrink-0"
                  >
                    <Link
                      href={agency.url}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <Image
                        key={agency.name}
                        alt={`logo image for ${agency.name} agency`}
                        className="h-full w-full object-contain"
                        src={`https:${agency.logoUrl}`}
                        width={0}
                        height={0}
                        sizes="100vw"
                        priority
                      />
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Marquee>
      </div>
      <p className="flex justify-center items-center text-2xl font-mono mt-2 flex-wrap gap-x-4 gap-y-1 px-4">
        <span className="font-semibold text-foreground/90">
          {t("apply-before")}
        </span>
        <span className="flex items-center justify-center flex-wrap gap-y-1">
          <Button variant="secondary" className="text-xl font-mono" asChild>
            <Link href="/apply">{t("apply-action")}</Link>
          </Button>
          <span className="ml-4 font-semibold text-foreground/90">
            {t("apply-after")}
          </span>
        </span>
      </p>
    </PageSection>
  );
};
