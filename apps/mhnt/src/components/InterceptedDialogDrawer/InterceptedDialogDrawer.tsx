"use client";

import { useCloseIntercepted } from "@/lib/hooks";
import {
  DialogDrawer,
  DialogDrawerProps,
} from "@shared/ui/components/DialogDrawer/DialogDrawer";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import Link from "next/link";
import { ArrowBigLeft } from "lucide-react";
import { Button } from "@shared/ui/components/button";
import { useTranslations } from "next-intl";
import { APP_ROUTES_CONFIG } from "@/lib/routes/routes";

interface InterceptedDialogDrawerProps
  extends Omit<DialogDrawerProps, "isOpen" | "onClose" | "title" | "backBtn"> {
  targetPath: string;
}

const ROUTE_LOOKUP = Object.fromEntries(
  Object.values(APP_ROUTES_CONFIG).map((route) => [route.href, route.key])
);

export const InterceptedDialogDrawer = ({
  targetPath,
  children,
  ...rest
}: InterceptedDialogDrawerProps) => {
  const pathname = usePathname();
  const params = useSearchParams();
  const { onInterceptedClose } = useCloseIntercepted();
  const t = useTranslations("ROUTES_TITLES");

  const isOpen = useMemo(
    () => pathname.startsWith(targetPath),
    [pathname, targetPath]
  );

  const routeId = useMemo(
    () => ROUTE_LOOKUP[pathname] ?? "default",
    [pathname]
  );

  const pathSegments = useMemo(() => pathname.split("/"), [pathname]);

  const backButtonHref = useMemo(() => {
    if (pathSegments.length <= 2) return null;

    const basePath = pathSegments.slice(0, -1).join("/");
    const queryString = params.size > 0 ? `?${params.toString()}` : "";
    return `${basePath}${queryString}`;
  }, [pathSegments, params]);

  const backButton = useMemo(() => {
    if (!backButtonHref) return undefined;

    return (
      <Button
        asChild
        variant="secondary"
        size="reset"
        className="absolute top-0 left-4 p-1 [&_svg]:size-8"
      >
        <Link href={backButtonHref}>
          <ArrowBigLeft />
        </Link>
      </Button>
    );
  }, [backButtonHref]);

  return (
    <DialogDrawer
      {...rest}
      title={t(routeId)}
      isOpen={isOpen}
      backBtn={backButton}
      onClose={onInterceptedClose}
    >
      {children}
    </DialogDrawer>
  );
};
