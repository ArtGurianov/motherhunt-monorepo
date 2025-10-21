import { AppSession } from "@/data/session/types";
import { useQuery } from "@tanstack/react-query";
import { createQueryFn } from "../utils/createQueryFn";
import { SESSION_QUERY_KEY } from "./keys";

export const useSession = () => {
  return useQuery({
    queryKey: [SESSION_QUERY_KEY],
    queryFn: createQueryFn<AppSession>("/api/data/getSession"),
    enabled: typeof window !== "undefined",
  });
};
