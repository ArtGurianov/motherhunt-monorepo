import { Hero } from "./_components/Hero";
import { Mission } from "./_components/Mission";
import { Agencies } from "./_components/Agencies";
import { BeforeAfterWrapper } from "./_components/BeforeAfter";

export default function Home() {
  return (
    <>
      <Hero />
      <Mission />
      <BeforeAfterWrapper>
        <Agencies />
        {/* TODO: DELETE TEMPORARY FOR EXTRA HEIGHT */}
        <div className="w-full h-96"></div>
      </BeforeAfterWrapper>
      <div className="w-full h-96"></div>
    </>
  );
}
