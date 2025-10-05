import { AppSession } from "@/data/session/types";
import { useQuery } from "@tanstack/react-query";
import { createQueryFn } from "../utils/createQueryFn";

export const useSession = () => {
  return useQuery({
    queryKey: ["my-session"],
    queryFn: createQueryFn<AppSession>("/api/data/getSession"),
  });
};
