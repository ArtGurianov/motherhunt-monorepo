import { useRouter, useSearchParams } from "next/navigation";

export const useCloseIntercepted = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  const updatedParams = new URLSearchParams(searchParams.toString());
  updatedParams.delete("returnTo");

  return {
    onInterceptedClose: () => {
      router.push(
        `${returnTo ?? "/"}${updatedParams.size ? "?" + updatedParams.toString() : ""}`
      );
    },
  };
};
