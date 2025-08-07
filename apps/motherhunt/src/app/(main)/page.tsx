import { Hero } from "./_components/Hero";
import { Mission } from "./_components/Mission";
import { Agencies } from "./_components/Agencies";
import { BeforeAfterWrapper } from "./_components/BeforeAfter";
import { Testimonials } from "./_components/Testimonials";

export default function Home() {
  return (
    <>
      <Hero />
      <Mission />
      <BeforeAfterWrapper>
        <Agencies />
        <Testimonials />
      </BeforeAfterWrapper>
    </>
  );
}
