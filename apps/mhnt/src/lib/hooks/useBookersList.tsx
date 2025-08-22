import { useQuery } from "@tanstack/react-query";
import { getBookersList } from "@/actions/getBookersList";

export const useBookersList = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ["bookersList"] as const,
    queryFn: () => getBookersList(),
  });

  return {
    data: data?.data,
    isPending,
    errorMessage: error?.message || data?.errorMessage,
  };
};
