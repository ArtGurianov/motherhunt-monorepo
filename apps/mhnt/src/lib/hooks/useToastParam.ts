import { toast } from "@shared/ui/components/sonner";
import { ValueOf } from "@shared/ui/lib/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const TOAST_KEYS = {
  SIGNED_IN: "SIGNED_IN",
  SIGNED_OUT: "SIGNED_OUT",
  UPDATED: "UPDATED",
};
type ToastKey = ValueOf<typeof TOAST_KEYS>;

const TOASTS_DICT: Record<ToastKey, string> = {
  [TOAST_KEYS.SIGNED_IN]: "Signed in!",
  [TOAST_KEYS.SIGNED_OUT]: "Signed out!",
  [TOAST_KEYS.UPDATED]: "Successfully updated!",
};

export const useToastParam = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const key = params.get("toast");

  useEffect(() => {
    if (!key) return;
    const updatedParams = new URLSearchParams(params.toString());
    updatedParams.delete("toast");

    const timerId = setTimeout(() => {
      if (key in TOASTS_DICT) {
        toast(TOASTS_DICT[key]);
      }

      router.replace(
        `${pathname}${updatedParams.size ? "?" + updatedParams.toString() : ""}`
      );
    });

    return () => {
      clearTimeout(timerId);
    };
  }, [key]);
};
