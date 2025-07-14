import { PrismaClient } from "@shared/db";
import { getEnvConfigServer } from "./config/env";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prismaClient = globalForPrisma.prisma || new PrismaClient();

if (getEnvConfigServer().NODE_ENV !== "production")
  globalForPrisma.prisma = prismaClient;

export { prismaClient };
