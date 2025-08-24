import { toast } from "@shared/ui/components/sonner";
import { useTranslations } from "next-intl";
import { useUrlParamAction } from "./useUrlParamAction";

export const TOAST_PARAM_URL_TOKEN = "toast" as const;

export const useToastParam = () => {
  const t = useTranslations("TOASTS");
  useUrlParamAction(TOAST_PARAM_URL_TOKEN, (value) => {
    toast(t(value) || "Message not provided");
  });
};
