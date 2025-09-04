import { Button } from "@shared/ui/components/button";
import Image from "next/image";
import Link from "next/link";

interface LotCardProps {
  alias: string;
  bgUrl: string | null;
  href: string;
}

export const LotCard = ({ alias, bgUrl, href }: LotCardProps) => {
  return (
    <Button asChild className="w-full h-auto max-w-72 aspect-3/4">
      <Link href={href} className="relative">
        <Image
          src={bgUrl || "/lot-default-bg.png"}
          alt="lot card"
          width="0"
          height="0"
          sizes="100vh"
          className="h-full w-full object-contain"
          priority
        />
        <span className="absolute bottom-2 left-0 z-10 w-full text-center font-medium text-xl font-mono p-1 bg-linear-to-r from-secondary/0 via-secondary/50 to-secondary/0 px-4">
          {alias}
        </span>
      </Link>
    </Button>
  );
};
