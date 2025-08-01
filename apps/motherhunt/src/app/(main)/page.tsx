import { Hero } from "./_components/Hero";
import { Mission } from "./_components/Mission";
import { Agencies } from "./_components/Agencies";
import { BeforeAfter } from "./_components/BeforeAfter";
import { PageSection } from "@shared/ui/components/PageSection";

export default function Home() {
  return (
    <>
      <Hero />
      <Mission />
      <PageSection
        fullWidth
        className="relative w-full before:tearTop after:tearBottom bg-vignette"
      >
        <BeforeAfter />
      </PageSection>
      <Agencies />
    </>
  );
}
