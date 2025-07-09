import { PrismaClient } from "@prisma/client";
const prismaClient = new PrismaClient();

async function main() {
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
  if (!superAdminEmail) throw new Error("Admin email not provided");

  const admin = await prismaClient.user.upsert({
    where: { email: superAdminEmail },
    create: {
      email: superAdminEmail,
      name: "Super Admin",
      emailVerified: true,
      role: "SUPER_ADMIN_ROLE",
    },
    update: {},
  });
  console.info("Initial App Admin email: ", admin.email);
}

main()
  .then(async () => {
    await prismaClient.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prismaClient.$disconnect();
    process.exit(1);
  });
