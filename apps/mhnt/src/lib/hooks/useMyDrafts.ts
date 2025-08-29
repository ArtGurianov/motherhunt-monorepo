import { getMyDrafts } from "@/actions/getMyDrafts";
import { useQuery } from "@tanstack/react-query";

export const useMyDrafts = () => {
  return useQuery({
    queryKey: ["my-drafts"],
    queryFn: getMyDrafts,
  });
};
