import z from "zod";

export const magicLinkFormSchema = z.object({
  email: z.string().email(),
  hCaptchaToken: z.string().min(1, { message: "You must verify you're human" }),
});
