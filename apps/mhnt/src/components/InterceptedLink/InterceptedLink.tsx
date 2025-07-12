"use client";

import { useAppParams } from "@/lib/hooks/useAppParams";
import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { HTMLAttributes } from "react";

export const InterceptedLink = (
  props: LinkProps & HTMLAttributes<HTMLAnchorElement>
) => {
  const pathname = usePathname();
  const { getParam, setParam, getUpdatedParamsString } = useAppParams();

  const hasReturn = getParam("returnTo");
  if (!hasReturn) setParam("returnTo", pathname);

  return <Link {...props} href={`${props.href}${getUpdatedParamsString()}`} />;
};
