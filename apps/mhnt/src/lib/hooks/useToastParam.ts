import { toast } from "@shared/ui/components/sonner";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppParams } from "./useAppParams";

export const useToastParam = () => {
  const router = useRouter();
  const { getParam, deleteParam, getUpdatedPathString } = useAppParams();
  const key = getParam("toast");
  const t = useTranslations("TOASTS");

  useEffect(() => {
    if (!key) return;
    deleteParam("toast");

    const timerId = setTimeout(() => {
      toast(t(key) || "Message not provided");

      router.replace(getUpdatedPathString());
    });

    return () => {
      clearTimeout(timerId);
    };
  }, [key]);
};
