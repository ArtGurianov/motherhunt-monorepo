import { PrismaClient } from "@prisma/client";
const prismaClient = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) throw new Error("Admin email not provided");

  const admin = await prismaClient.user.upsert({
    where: { email: adminEmail },
    create: {
      email: adminEmail,
      name: "App Owner",
      emailVerified: true,
    },
    update: { email: adminEmail },
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
