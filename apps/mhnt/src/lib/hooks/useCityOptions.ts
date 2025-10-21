import { useQuery } from "@tanstack/react-query";
import { Country } from "../dictionaries/countriesList";
import { getCitiesByCountry } from "@/actions/getCitiesByCountry";
import { CITIES_QUERY_KEY } from "./keys";

export const useCityOptions = (country: Country) => {
  return useQuery({
    queryKey: [CITIES_QUERY_KEY, country],
    queryFn: async () => {
      return await getCitiesByCountry(country!);
    },
    enabled: typeof window !== "undefined" && !!country && country.length > 0,
    staleTime: Infinity,
    gcTime: 10 * 60 * 1000,
  });
};
