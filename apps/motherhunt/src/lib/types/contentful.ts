import { EntryFieldTypes } from "contentful";

export type DisplayAgencyContentfulSkeleton = {
  contentTypeId: "displayAgency";
  fields: {
    name: EntryFieldTypes.Text;
    url: EntryFieldTypes.Text;
    logo: EntryFieldTypes.AssetLink;
  };
};
