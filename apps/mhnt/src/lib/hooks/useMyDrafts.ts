import { useQuery } from "@tanstack/react-query";
import { Lot } from "@shared/db";
import { createQueryFn } from "../utils/createQueryFn";

export const useMyDrafts = () => {
  return useQuery({
    queryKey: ["my-drafts"],
    queryFn: createQueryFn<Lot[]>("/api/data/getMyDrafts"),
  });
};
