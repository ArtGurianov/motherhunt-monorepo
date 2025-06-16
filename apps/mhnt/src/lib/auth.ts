import { prismaAdapter } from "better-auth/adapters/prisma";
import { prismaClient } from "./db";
import { betterAuth } from "better-auth";
import { magicLink } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  appName: "motherHunt",
  baseURL: "https://mhnt.local:3001",
  basePath: "/api/auth",
  database: prismaAdapter(prismaClient, {
    provider: "mongodb",
  }),
  plugins: [
    nextCookies(),
    magicLink({
      sendMagicLink: async ({ email, token, url }, request) => {
        console.log("READY TO SEND MAGIC LINK!: ", email, token, url);
      },
    }),
  ],
  // secondaryStorage: {},
  trustedOrigins: [
    "https://mhnt.local:3001",
    "https://mhnt.app",
    "https://motherhunt.com",
  ],
  // user: {
  //   modelName: "users",
  //   fields: {
  //     email: "email",
  //   },
  //   additionalFields: {
  //     customField: {
  //       type: "string",
  //     },
  //   },
  //   changeEmail: {
  //     enabled: true,
  //     sendChangeEmailVerification: async ({ user, newEmail, url, token }) => {
  //       // Send change email verification
  //     },
  //   },
  //   deleteUser: {
  //     enabled: true,
  //     sendDeleteAccountVerification: async ({ user, url, token }) => {
  //       // Send delete account verification
  //     },
  //     beforeDelete: async (user) => {
  //       // Perform actions before user deletion
  //     },
  //     afterDelete: async (user) => {
  //       // Perform cleanup after user deletion
  //     },
  //   },
  // },
});
