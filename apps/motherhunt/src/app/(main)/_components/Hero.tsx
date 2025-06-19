import HeroAnimationSvgUrl from "@/components/svg/HeroAnimation.svg?url";
import { PageSection } from "@/components/PageSection";
import { Button } from "@shared/ui/components/button";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getAppLocale, getAppURL } from "@shared/ui/lib/utils";

export const Hero = async () => {
  const t = await getTranslations("HOME.HERO");

  return (
    <PageSection className="flex flex-col lg:flex-row w-full justify-center items-center">
      <div className="w-full lg:w-1/2 flex flex-col gap-8 justify-center items-center py-8">
        <h1 className="text-5xl text-center">
          {t("title-start")}
          <br />
          {t("title-end")}
        </h1>
        <p className="text-center font-mono text-lg">{t("description")}</p>
        <div className="flex flex-wrap gap-6 w-full px-4 justify-center items-center">
          <Button variant="secondary" size="lg" asChild>
            <Link href="/guides">{t("apply-btn-label")}</Link>
          </Button>
          <Button size="lg">
            <Link href={getAppURL()}>{t("browse-btn-label")}</Link>
          </Button>
        </div>
      </div>
      <div className="relative w-full lg:w-1/2 h-full">
        <Image
          src={HeroAnimationSvgUrl}
          alt="hero-animation"
          width="0"
          height="0"
          sizes="100vh"
          className="h-full w-auto"
          priority
        />
      </div>
    </PageSection>
  );
};
