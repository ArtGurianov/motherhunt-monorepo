import { PageSection } from "@shared/ui/components/PageSection";
import { AppImage } from "@/components/AppImage/AppImage";
import { NotFoundCaption } from "@/components/NotFound/NotFoundCaption";

export default function NotFound() {
  return (
    <PageSection className="flex grow justify-center items-center">
      <div className="w-full max-w-sm flex flex-col justify-center items-center">
        <AppImage
          src="/404.png"
          width="0"
          height="0"
          sizes="100vw"
          alt="logo"
          className="h-auto w-full shrink-0"
          priority
        />
        <NotFoundCaption />
      </div>
    </PageSection>
  );
}
