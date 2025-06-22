"use client";

import Link, { LinkProps } from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { HTMLAttributes } from "react";

export const InterceptedLink = (
  props: LinkProps & HTMLAttributes<HTMLAnchorElement>
) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const updatedParams = new URLSearchParams(searchParams.toString());
  updatedParams.set("returnTo", pathname);

  return <Link {...props} href={`${props.href}?${updatedParams.toString()}`} />;
};
