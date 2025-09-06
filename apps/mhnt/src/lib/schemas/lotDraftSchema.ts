import z from "zod";

export const lotDraftSchema = z.object({
  sex: z.enum(["MALE", "FEMALE"]).or(z.literal("")),
  nickname: z.string().or(z.literal("")),
  name: z.string().min(3).or(z.literal("")),
  email: z.string().email().or(z.literal("")),
  birthDate: z.date(),
  bustSizeMM: z.coerce.number(),
  waistSizeMM: z.coerce.number(),
  hipsSizeMM: z.coerce.number(),
  feetSizeMM: z.coerce.number(),
  passportCitizenship: z.string().or(z.literal("")),
  locationCountry: z.string().or(z.literal("")),
  locationCity: z.string().or(z.literal("")),
  canTravel: z.boolean().or(z.literal("")),
  hasAgency: z.boolean().or(z.literal("")),
  googleDriveLink: z
    .string()
    .startsWith("https://drive.google.com/drive/")
    .or(z.literal("")),
});
