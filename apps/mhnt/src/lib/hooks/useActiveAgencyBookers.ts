import { useQuery } from "@tanstack/react-query";
import { createQueryFn } from "../utils/createQueryFn";
import { BookersData } from "@/data/agencyBookers/types";
import { BOOKERS_QUERY_KEY } from "./keys";

export const useActiveAgencyBookers = () => {
  return useQuery({
    queryKey: [BOOKERS_QUERY_KEY],
    queryFn: createQueryFn<BookersData>("/api/data/getActiveAgencyBookers"),
    enabled: typeof window !== "undefined",
  });
};
