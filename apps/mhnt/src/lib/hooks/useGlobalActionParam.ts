import { toast } from "@shared/ui/components/sonner";
import { useTranslations } from "next-intl";
import { useUrlParamAction } from "./useUrlParamAction";
import { authClient } from "../auth/authClient";
import { useQueryClient } from "@tanstack/react-query";
import { SESSION_QUERY_KEY } from "./keys";

export const ACTION_PARAM_URL_TOKEN = "action" as const;

export const useGlobalActionParam = () => {
  const t = useTranslations("TOASTS");
  const queryClient = useQueryClient();
  useUrlParamAction(ACTION_PARAM_URL_TOKEN, (value) => {
    if (value === 'SIGN_OUT') {
      toast(t('SIGNED_OUT') || "Message not provided");
      authClient.signOut({
        fetchOptions: { onSuccess: () => { queryClient.invalidateQueries({ queryKey: [SESSION_QUERY_KEY] }) } }
      })
    }
  });
};
