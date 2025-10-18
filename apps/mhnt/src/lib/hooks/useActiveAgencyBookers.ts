import { useQuery } from "@tanstack/react-query";
import { createQueryFn } from "../utils/createQueryFn";
import { BookersData } from "@/data/agencyBookers/types";

export const useActiveAgencyBookers = () => {
  return useQuery({
    queryKey: ["my-drafts"],
    queryFn: createQueryFn<BookersData>("/api/data/getActiveAgencyBookers"),
    enabled: typeof window !== "undefined",
  });
};
