import z from "zod";

export const addressSchema = z.object({
  address: z
    .string()
    .startsWith("0x", "Address must begin with 0x")
    .length(42, "Address length must be of 42 symbols"),
});
