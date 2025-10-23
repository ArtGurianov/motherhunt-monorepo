"use client";

import { useAppParams } from "@/lib/hooks";
import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { HTMLAttributes, useEffect } from "react";

export const InterceptedLink = (
  props: LinkProps & HTMLAttributes<HTMLAnchorElement>,
) => {
  const pathname = usePathname();
  const { getParam, setParam, getUpdatedParamsString } = useAppParams();

  // Only depend on pathname to avoid recreating effect on every render
  useEffect(() => {
    const hasReturn = getParam("returnTo");
    if (!hasReturn) {
      setParam("returnTo", pathname);
    }
  }, [pathname]);

  // Simple string concatenation doesn't need memoization
  const href = `${props.href}${getUpdatedParamsString()}`;

  return <Link {...props} href={href} />;
};
