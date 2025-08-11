import z from "zod";

export const web3AdminRequestBodySchema = z.object({
  signature: z
    .string({
      description: "Login request signed with private key",
    })
    .startsWith("0x"),
  address: z
    .string({
      description: "Address of signer wallet",
    })
    .startsWith("0x"),
});
