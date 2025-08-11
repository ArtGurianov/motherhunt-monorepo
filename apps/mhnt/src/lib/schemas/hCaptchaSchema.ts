import z from "zod";

export const hCaptchaSchema = z.object({
  hCaptchaToken: z.string().min(1, { message: "You must verify you're human" }),
});
