import { prismaAdapter } from "better-auth/adapters/prisma";
import { prismaClient } from "./db";
import { betterAuth } from "better-auth";
import { magicLink } from "better-auth/plugins";

export const auth = betterAuth({
  database: prismaAdapter(prismaClient, {
    provider: "mongodb",
  }),
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, token, url }, request) => {
        console.log("SENDING MAGIC LINK!: ", email, token, url);
      },
    }),
  ],
  // emailAndPassword: {
  //   enabled: false,
  // },
});
