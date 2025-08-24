import z from "zod";

export const vkCodeResponseSchema = z.object({
  code: z.string(),
  state: z.string(),
  type: z.literal("code_v2"),
  device_id: z.string(),
});
