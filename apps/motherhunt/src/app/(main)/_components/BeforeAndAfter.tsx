import {
  GemstoneFiveSvgUrl,
  GemstoneFourSvgUrl,
  GemstoneOneSvgUrl,
  GemstoneSixSvgUrl,
  GemstoneThreeSvgUrl,
  GemstoneTwoSvgUrl,
} from "@/components/svg/gemstones";
import { PageSection } from "@shared/ui/components/PageSection";
import Image from "next/image";

const gemstonesContent = [
  {
    svgPath: GemstoneOneSvgUrl,
    label: "all agencies",
  },
  {
    svgPath: GemstoneTwoSvgUrl,
    label: "fair prices",
  },
  {
    svgPath: GemstoneThreeSvgUrl,
    label: "all models",
  },
  {
    svgPath: GemstoneFourSvgUrl,
    label: "web3 auction",
  },
  {
    svgPath: GemstoneFiveSvgUrl,
    label: "all scouters",
  },
  {
    svgPath: GemstoneSixSvgUrl,
    label: "earn together",
  },
] as const;

export const BeforeAndAfter = () => {
  return (
    <PageSection
      fullWidth
      className="relative w-full before:tearTop after:tearBottom bg-vignette"
    >
      <div className="absolute -z-10 top-0 left-0 w-full h-full bg-gradient-to-br from-amber-900 to-yellow-900">
        <div className="w-full h-full bg-gradient-to-tr from-amber-800 to-yellow-800 steampunk vignette"></div>
      </div>
      <div className="flex flex-col w-full justify-center items-center py-4">
        <div className="flex w-full justify-center items-center">
          <div className="shrink-0">
            <Image
              src="/SteamPunk.png"
              alt="steampunk"
              width="0"
              height="0"
              sizes="100vh"
              className="h-48 lg:h-64 w-auto shadow-yellow-900 shadow-lg"
              priority
            />
          </div>
          <div className="p-4 md:px-8 flex flex-col gap-4 justify-between self-stretch">
            <h2 className="text-3xl font-light lg:text-7xl w-full text-amber-950 text-end font-steampunk-title">
              {"HOW THE INDUSTRY WAS BACK THEN"}
            </h2>
            <div className="grow flex justify-center items-center">
              <span className="text-md lg:text-2xl text-end italic font-dyna-puff font-thin text-yellow-950">
                {
                  "'So there was a scouter working for that one little agency. Used to have a few coins thrown at him from time to time… Agency booker came in bad mood that morning - the real GEM newface was rejected and lost forever…'"
                }
              </span>
            </div>
          </div>
        </div>
        <h2 className="text-5xl font-light lg:text-7xl w-full text-secondary text-center font-steampunk-title mt-4">
          {"! NOT ANYMORE !"}
        </h2>
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 place-items-center">
          {gemstonesContent.map((each, index) => (
            <div key={index} className="relative m-4 size-36">
              <Image
                src={each.svgPath}
                alt="gemstone-image"
                width="0"
                height="0"
                sizes="100vh"
                className="h-full w-auto opacity-80 animate-pulse"
                priority
              />
              <span className="absolute -translate-x-1/2 left-1/2 -translate-y-1/2 top-1/2 text-center text-4xl font-bold font-mono text-black/60 rotate-6">
                {each.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </PageSection>
  );
};
