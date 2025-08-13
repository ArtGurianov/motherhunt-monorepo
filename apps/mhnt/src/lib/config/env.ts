import { z } from "zod";

const CLIENT_ENV = {
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_NETWORK: process.env.NEXT_PUBLIC_NETWORK,
  NEXT_PUBLIC_APP_LOCALE: process.env.NEXT_PUBLIC_APP_LOCALE,
  NEXT_PUBLIC_SYSTEM_CONTRACT_ADDRESS:
    process.env.NEXT_PUBLIC_SYSTEM_CONTRACT_ADDRESS,
  NEXT_PUBLIC_AUCTION_CONTRACT_ADDRESS:
    process.env.NEXT_PUBLIC_AUCTION_CONTRACT_ADDRESS,
  NEXT_PUBLIC_KARMA_CONTRACT_ADDRESS:
    process.env.NEXT_PUBLIC_KARMA_CONTRACT_ADDRESS,
  NEXT_PUBLIC_HCAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY,
  NEXT_PUBLIC_REOWN_PROJECT_ID: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID,
  NEXT_PUBLIC_VK_CLIENT_ID: process.env.NEXT_PUBLIC_VK_CLIENT_ID,
} as const;

const clientEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"], {
    description: "This gets updated depending on your environment",
  }),
  NEXT_PUBLIC_NETWORK: z.enum(["testnet", "mainnet"], {
    description: "Network for blockchain deployments",
  }),
  NEXT_PUBLIC_APP_LOCALE: z.enum(["en-US", "ru-RU", "cn-CN", "es-ES"], {
    description: "Language Locale",
  }),
  NEXT_PUBLIC_HCAPTCHA_SITE_KEY: z.string(),
  NEXT_PUBLIC_REOWN_PROJECT_ID: z.string(),
  NEXT_PUBLIC_SYSTEM_CONTRACT_ADDRESS: z
    .string({
      description: "Contract address for system smart contract.",
    })
    .startsWith("0x"),
  NEXT_PUBLIC_AUCTION_CONTRACT_ADDRESS: z
    .string({
      description: "Contract address for auction smart contract.",
    })
    .startsWith("0x"),
  NEXT_PUBLIC_KARMA_CONTRACT_ADDRESS: z
    .string({
      description: "Contract address for karma smart contract.",
    })
    .startsWith("0x"),
  NEXT_PUBLIC_VK_CLIENT_ID: z.string(),
});

const serverEnvSchema = clientEnvSchema.extend({
  DATABASE_URL: z
    .string({
      description: "MongoDB Connection string",
    })
    .url(),
  BETTER_AUTH_SECRET: z.string({
    description: "Random secret string to use in Better Auth library",
  }),
  NODEMAILER_USER: z
    .string({ description: "Email to send notifications from" })
    .email(),
  NODEMAILER_APP_PASSWORD: z.string(),
  HCAPTCHA_SECRET_KEY: z.string(),
  VK_CLIENT_SECRET: z.string(),
});

export const getEnvConfigClient = () => {
  const validationResult = clientEnvSchema.safeParse(CLIENT_ENV);
  if (!validationResult.success) {
    const errorStr = validationResult.error.errors.reduce(
      (temp, next) =>
        `${temp} ${next.path.toString().toUpperCase()} - ${next.message};`,
      ""
    );
    throw new Error(`Env vars validation failed: ${errorStr}`);
  }
  return validationResult.data;
};

export const getEnvConfigServer = () => {
  const validationResult = serverEnvSchema.safeParse(process.env);
  if (!validationResult.success) {
    const errorStr = validationResult.error.errors.reduce(
      (temp, next) =>
        `${temp} ${next.path.toString().toUpperCase()} - ${next.message};`,
      ""
    );
    throw new Error(`Env vars validation failed: ${errorStr}`);
  }
  return validationResult.data;
};
