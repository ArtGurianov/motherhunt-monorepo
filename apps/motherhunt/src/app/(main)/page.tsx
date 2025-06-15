import { Hero } from "./_components/Hero";
import { Mission } from "./_components/Mission";
import { Agencies } from "./_components/Agencies";

export default function Home() {
  return (
    <div className="flex flex-col gap-12 grow justify-start items-center pb-12">
      <Hero />
      <Mission />
      <Agencies />
    </div>
  );
}
