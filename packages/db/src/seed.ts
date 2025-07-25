import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

async function main() {
  const result = await prismaClient.$transaction([
    prismaClient.user.count({
      where: { role: "MYDAOGS_ADMIN_ROLE" },
    }),
    prismaClient.user.count({
      where: { role: "PROJECT_SUPERADMIN_ROLE" },
    }),
    prismaClient.user.count({
      where: { role: "PROJECT_ADMIN_ROLE" },
    }),
  ]);

  if (new Set(result).size > 1)
    throw new Error("Seeding error. Inconsistent admin entities.");

  if (result[0] === 0) {
    try {
      await prismaClient.user.createMany({
        data: [
          {
            role: "MYDAOGS_ADMIN_ROLE",
            email: "motherhunt@mydaogs.com",
            emailVerified: true,
            name: "MYDAOGS ADMIN",
          },
          {
            role: "PROJECT_SUPERADMIN_ROLE",
            email: "app-superadmin@motherhunt.com",
            emailVerified: true,
            name: "SUPER ADMIN",
          },
          {
            role: "PROJECT_ADMIN_ROLE",
            email: "app-admin@motherhunt.com",
            emailVerified: true,
            name: "ADMIN",
          },
        ],
      });
      console.log("Successfully seeded.");
    } catch {
      console.log(
        "An error occured while seeding admin accounts to the database."
      );
    }
  }
}

main()
  .then(async () => {
    await prismaClient.$disconnect();
    console.log("Seeding complete.");
  })
  .catch(async (e) => {
    console.error(e);
    await prismaClient.$disconnect();
    process.exit(1);
  });
