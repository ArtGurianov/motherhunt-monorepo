import { PageSection } from "@shared/ui/components/PageSection";
import { GUIDES_CONFIG, GUIDES_ORDER } from "./_config";
import { useTranslations } from "next-intl";
import { Button } from "@shared/ui/components/button";
import Link from "next/link";

export default function GuidesPage() {
  const t = useTranslations("GUIDES");

  return (
    <PageSection className="py-12 flex flex-col gap-4">
      {GUIDES_ORDER.map((guide) => (
        <Button
          asChild
          variant="secondary"
          className="w-full h-32 text-wrap text-4xl"
          key={guide}
        >
          <Link href={GUIDES_CONFIG[guide].url}>{t(guide)}</Link>
        </Button>
      ))}
    </PageSection>
  );
}
