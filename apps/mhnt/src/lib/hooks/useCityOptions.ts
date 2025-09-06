import { useQuery } from "@tanstack/react-query";
import { Country } from "../dictionaries/countriesList";
import { getCitiesByCountry } from "@/actions/getCitiesByCountry";

export const useCityOptions = (country: Country) => {
  return useQuery({
    queryKey: ["cities", country],
    queryFn: () => {
      return getCitiesByCountry(country!);
    },
    enabled: !!country.length,
  });
};
