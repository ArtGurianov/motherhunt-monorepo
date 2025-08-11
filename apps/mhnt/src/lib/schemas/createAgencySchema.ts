import z from "zod";

export const createAgencySchema = z.object({
  name: z.string().min(3),
  slug: z.string().min(3),
});
