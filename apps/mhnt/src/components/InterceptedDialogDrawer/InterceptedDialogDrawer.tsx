"use client";

import { useAppParams } from "@/lib/hooks";
import {
  DialogDrawer,
  DialogDrawerProps,
} from "@shared/ui/components/DialogDrawer/DialogDrawer";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowBigLeft } from "lucide-react";
import { Button } from "@shared/ui/components/button";
import { useTranslations } from "next-intl";
import { APP_ROUTES, APP_ROUTES_CONFIG } from "@/lib/routes/routes";

const ROUTE_LOOKUP = Object.fromEntries(
  Object.values(APP_ROUTES_CONFIG).map((route) => [route.href, route.key]),
);
interface InterceptedDialogDrawerProps
  extends Omit<DialogDrawerProps, "isOpen" | "onClose" | "title" | "backBtn"> {
  targetPath: string;
}

export const InterceptedDialogDrawer = ({
  targetPath,
  children,
  ...rest
}: InterceptedDialogDrawerProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const pathSegments = pathname.split("/");

  const { getParam, deleteParam, getUpdatedParamsString } = useAppParams();

  const t = useTranslations("ROUTES_TITLES");

  return (
    <DialogDrawer
      {...rest}
      title={t(ROUTE_LOOKUP[pathname] ?? "default")}
      isOpen={pathname.startsWith(targetPath)}
      backBtn={
        pathSegments.length > 2 ? (
          <Button
            asChild
            variant="secondary"
            size="reset"
            className="absolute top-0 left-4 p-1 [&_svg]:size-8"
          >
            <Link
              href={`${pathSegments.slice(0, -1).join("/")}${getUpdatedParamsString()}`}
            >
              <ArrowBigLeft />
            </Link>
          </Button>
        ) : null
      }
      onClose={() => {
        const returnTo = getParam("returnTo");
        deleteParam("returnTo");
        const updatedParams = getUpdatedParamsString();
        router.push(
          `${returnTo ?? APP_ROUTES_CONFIG[APP_ROUTES.AUCTION].href}${updatedParams}`,
        );
      }}
    >
      {children}
    </DialogDrawer>
  );
};
