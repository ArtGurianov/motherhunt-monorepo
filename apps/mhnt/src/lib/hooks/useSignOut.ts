import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "@shared/ui/components/sonner";
import { useTranslations } from "next-intl";
import { authClient } from "../auth/authClient";
import { SESSION_QUERY_KEY } from "./keys";
import { APP_ROUTES, APP_ROUTES_CONFIG } from "../routes/routes";

export const useSignOut = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("TOASTS");

  const signOut = async () => {
    startTransition(async () => {
      try {
        // Immediately clear session from cache to prevent components from seeing stale data
        // This is crucial to avoid "Unauthorized" errors in other components during sign-out
        queryClient.setQueryData([SESSION_QUERY_KEY], null);

        // Perform the actual sign-out on the server
        await authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              // Invalidate and refetch to ensure fresh data state
              queryClient.invalidateQueries({ queryKey: [SESSION_QUERY_KEY] });
            },
          },
        });

        // Show success notification
        toast(t("SIGNED_OUT") || "Successfully signed out");

        // Redirect to auction/home page
        // The QueryErrorBoundary will catch any "Unauthorized" errors from components
        // and redirect them to the sign-in page if needed
        router.push(APP_ROUTES_CONFIG[APP_ROUTES.AUCTION].href);
      } catch (error) {
        console.error("Sign out error:", error);
        toast.error("Failed to sign out. Please try again.");
      }
    });
  };

  return {
    signOut,
    isPending,
  };
};
