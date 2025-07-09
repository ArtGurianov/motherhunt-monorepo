"use client";

import { useCloseIntercepted } from "@/lib/hooks";
import {
  DialogDrawer,
  DialogDrawerProps,
} from "@shared/ui/components/DialogDrawer/DialogDrawer";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowBigLeft } from "lucide-react";
import { Button } from "@shared/ui/components/button";
import { useTranslations } from "next-intl";
import { APP_ROUTES_CONFIG } from "@/lib/routes/routes";

interface InterceptedDialogDrawerProps
  extends Omit<DialogDrawerProps, "isOpen" | "onClose" | "title" | "backBtn"> {
  targetPath: string;
}

export const InterceptedDialogDrawer = ({
  targetPath,
  children,
  ...rest
}: InterceptedDialogDrawerProps) => {
  const pathname = usePathname();
  const particles = pathname.split("/");
  const params = useSearchParams();
  const { onInterceptedClose } = useCloseIntercepted();
  const t = useTranslations("ROUTES_TITLES");

  const routeId =
    Object.values(APP_ROUTES_CONFIG).find((each) => each.href === pathname)
      ?.key ?? "default";

  const [isOpen, setIsOpen] = useState(pathname.startsWith(targetPath));
  useEffect(() => {
    setIsOpen(pathname.startsWith(targetPath));
  }, [pathname]);

  return (
    <DialogDrawer
      title={t(routeId)}
      {...rest}
      isOpen={isOpen}
      backBtn={
        particles.length > 2 ? (
          <Button
            asChild
            variant="secondary"
            size="reset"
            className="absolute top-0 left-4 p-px"
          >
            <Link
              href={`${particles.slice(0, particles.length - 1).join("/")}${params.size ? "?" + params.toString() : ""}`}
            >
              <ArrowBigLeft />
            </Link>
          </Button>
        ) : undefined
      }
      onClose={() => {
        onInterceptedClose();
      }}
    >
      {children}
    </DialogDrawer>
  );
};
