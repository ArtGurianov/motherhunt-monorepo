import { toast } from "@shared/ui/components/sonner";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export const useToastParam = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const key = params.get("toast");
  const t = useTranslations("TOASTS");

  useEffect(() => {
    if (!key) return;
    const updatedParams = new URLSearchParams(params.toString());
    updatedParams.delete("toast");

    const timerId = setTimeout(() => {
      toast(t(key) || "Message not provided");

      router.replace(
        `${pathname}${updatedParams.size ? "?" + updatedParams.toString() : ""}`
      );
    });

    return () => {
      clearTimeout(timerId);
    };
  }, [key]);
};
