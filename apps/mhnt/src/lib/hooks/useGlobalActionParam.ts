import { toast } from "@shared/ui/components/sonner";
import { useTranslations } from "next-intl";
import { useUrlParamAction } from "./useUrlParamAction";
import { authClient } from "../auth/authClient";
import { useSession } from "./useSession";

export const ACTION_PARAM_URL_TOKEN = "action" as const;

export const useGlobalActionParam = () => {
  const { refetch } = useSession();
  const t = useTranslations("TOASTS");
  useUrlParamAction(ACTION_PARAM_URL_TOKEN, (value) => {
    if (value === 'SIGN_OUT') {
      toast(t('SIGNED_OUT') || "Message not provided");
      authClient.signOut().then(() => {
        refetch();
      })
    }
  });
};
