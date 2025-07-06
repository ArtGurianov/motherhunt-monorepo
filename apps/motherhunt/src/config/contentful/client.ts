import { createClient, EntrySkeletonType } from "contentful";
import { AppClientError } from "@shared/ui/lib/utils/appClientError";

if (!process.env.CONTENTFUL_SPACE_ID)
  throw new AppClientError("env variable CONTENTFUL_SPACE_ID not provided!");
if (!process.env.CONTENTFUL_ACCESS_TOKEN)
  throw new AppClientError(
    "env variable CONTENTFUL_ACCESS_TOKEN not provided!"
  );

export const contentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

export const getContentfulEntriesByType = async <T extends EntrySkeletonType>(
  type: string,
  limit: number = 10
) => {
  const response =
    await contentfulClient.withoutUnresolvableLinks.getEntries<T>({
      content_type: type,
      limit,
    });

  return response.items;
};

export const getContentfulEntryBySlug = async <T extends EntrySkeletonType>(
  slug: string,
  type: string
) => {
  const queryOptions = {
    content_type: type,
    "fields.slug[match]": slug,
  };
  const queryResult =
    await contentfulClient.withoutUnresolvableLinks.getEntries<T>(queryOptions);
  return queryResult.items[0];
};
