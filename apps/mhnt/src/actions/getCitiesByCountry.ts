"use server";

import { CITIES_MAP } from "@/lib/dictionaries/citiesMap";
import { COUNTRIES_LIST, Country } from "@/lib/dictionaries/countriesList";
import { createActionResponse } from "@/lib/utils/createActionResponse";
import { AppClientError } from "@shared/ui/lib/utils/appClientError";

export const getCitiesByCountry = async (country: Country) => {
  try {
    if (!COUNTRIES_LIST.includes(country)) {
      throw new AppClientError("Country not found");
    }
    return createActionResponse({ data: CITIES_MAP[country] });
  } catch (error) {
    return createActionResponse({ error });
  }
};
