"use client";

import { PageSection } from "@shared/ui/components/PageSection";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <PageSection className="flex grow justify-center items-center">
      <div className="w-full max-w-sm flex flex-col justify-center items-center">
        <Image
          src="/404.png"
          width="0"
          height="0"
          sizes="100vw"
          alt="logo"
          className="h-auto w-full shrink-0"
          priority
        />
        <span className="text-lg text-foreground/90">
          {"Page not found"}
          <Link className="ml-2 underline" href="/">
            {"Let's just go home"}
          </Link>
        </span>
      </div>
    </PageSection>
  );
}
