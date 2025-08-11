import z from "zod";

export const commentSchema = z.object({
  value: z.string().min(20),
});
