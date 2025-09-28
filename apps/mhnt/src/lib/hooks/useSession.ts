import { AppSession } from "@/data/types";
import { useQuery } from "@tanstack/react-query";
import { createActionResponse } from "@/lib/utils/createActionResponse";

export const useSession = () => {
  return useQuery({
    queryKey: ["my-session"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/data/getSession");
        const session = await res.json();
        return createActionResponse({ data: session as AppSession });
      } catch (error) {
        return createActionResponse({ error });
      }
    },
  });
};
