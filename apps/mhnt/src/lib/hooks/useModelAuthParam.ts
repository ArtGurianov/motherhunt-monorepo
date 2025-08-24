import { toast } from "@shared/ui/components/sonner";
import { useUrlParamAction } from "./useUrlParamAction";
import { authClient } from "../auth/authClient";
import { useMemo } from "react";
import { useTranslations } from "next-intl";

export const MODEL_AUTH_URL_TOKEN = "modelAuth" as const;

export const useModelAuthParam = () => {
  const t = useTranslations("TOASTS");
  const { data: session } = authClient.useSession();

  const handleModelAuth = useMemo(() => {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    return (_: string) => {
      if (session?.user.modelOrganizationId) {
        authClient.organization
          .setActive({
            organizationId: session.user.modelOrganizationId,
          })
          .then(() => {
            toast(t("SIGNED_IN"));
          })
          .catch(() => {
            toast(t("unexpected-error"));
          });
      } else {
        toast(t("unexpected-error"));
      }
    };
  }, [session]);

  useUrlParamAction(MODEL_AUTH_URL_TOKEN, handleModelAuth);
};
