import { PageSection } from "@shared/ui/components/PageSection";
import Image from "next/image";

export const BeforeAndAfter = () => {
  return (
    <PageSection
      fullWidth
      className="relative w-full before:tearTop after:tearBottom bg-vignette"
    >
      <div className="absolute -z-10 top-0 left-0 w-full h-full bg-yellow-800">
        <div className="w-full h-full bg-yellow-700 steampunk vignette"></div>
      </div>
      <div className="flex w-full justify-center items-center py-4">
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
      <div className="absolute top-0 left-0 w-full h-full">
        {/* {'AFTER'} */}
      </div>
    </PageSection>
  );
};
