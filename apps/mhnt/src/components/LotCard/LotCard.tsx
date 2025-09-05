import { Button } from "@shared/ui/components/button";
import { AppImage } from "../AppImage/AppImage";
import Link from "next/link";

interface LotCardProps {
  nickname: string | null;
  bgUrl: string | null;
  href: string;
}

export const LotCard = ({ nickname, bgUrl, href }: LotCardProps) => {
  return (
    <Button
      size="reset"
      asChild
      className="w-full h-auto max-w-72 aspect-3/4 overflow-clip"
    >
      <Link href={href} className="relative">
        <AppImage
          src={bgUrl || "/lot-default-bg.png"}
          alt="lot card"
          width="0"
          height="0"
          sizes="100vh"
          className="h-full w-full object-cover"
          priority
        />
        <span className="absolute bottom-2 left-0 z-10 w-full text-center font-medium text-xl font-mono p-1 bg-linear-to-r from-secondary/0 via-secondary/50 to-secondary/0 px-4">
          {nickname ?? "Model Draft"}
        </span>
      </Link>
    </Button>
  );
};
