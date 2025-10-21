import { useQuery } from "@tanstack/react-query";
import { Lot } from "@shared/db";
import { createQueryFn } from "../utils/createQueryFn";
import { DRAFTS_QUERY_KEY } from "./keys";

export const useMyDrafts = () => {
  return useQuery({
    queryKey: [DRAFTS_QUERY_KEY],
    queryFn: createQueryFn<Lot[]>("/api/data/getMyDrafts"),
    enabled: typeof window !== "undefined",
  });
};
