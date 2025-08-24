import z from "zod";

export const vkUserResponseSchema = z.object({
  user: z.object({
    user_id: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    avatar: z.string(),
    email: z.string(),
    sex: z.number(),
    verified: z.boolean(),
    birthday: z.string(),
  }),
});
