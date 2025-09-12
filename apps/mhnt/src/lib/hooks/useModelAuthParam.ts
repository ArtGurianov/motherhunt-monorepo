// import { toast } from "@shared/ui/components/sonner";
// import { useUrlParamAction } from "./useUrlParamAction";
// import { authClient } from "../auth/authClient";
// import { useMemo } from "react";
// import { useTranslations } from "next-intl";
// import { useAuth } from "@/components/AppProviders/AuthProvider";

// export const MODEL_AUTH_URL_TOKEN = "modelAuth" as const;

// export const useModelAuthParam = () => {
//   const { user } = useAuth();

//   const t = useTranslations("TOASTS");

//   const handleModelAuth = useMemo(() => {
//     /* eslint-disable @typescript-eslint/no-unused-vars */
//     return (_: string) => {
//       if (user.modelOrganizationId) {
//         authClient.organization
//           .setActive({
//             organizationId: user.modelOrganizationId,
//           })
//           .then(() => {
//             toast(t("SIGNED_IN"));
//           })
//           .catch(() => {
//             toast(t("unexpected-error"));
//           });
//       } else {
//         toast(t("unexpected-error"));
//       }
//     };
//   }, [user]);

//   useUrlParamAction(MODEL_AUTH_URL_TOKEN, handleModelAuth);
// };
