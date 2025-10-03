import { useQuery } from "@tanstack/react-query";
import { createActionResponse } from "@/lib/utils/createActionResponse";
import { Lot } from "@shared/db";

export const useMyDrafts = () => {
  return useQuery({
    queryKey: ["my-drafts"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/data/getMyDrafts");
        const drafts = await res.json();
        return createActionResponse({ data: drafts as Lot[] });
      } catch (error) {
        return createActionResponse({ error });
      }
    },
  });
};
