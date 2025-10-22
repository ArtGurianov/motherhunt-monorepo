import { AppRole } from "@/lib/auth/permissions/app-permissions";
import { ORG_ROLES } from "@/lib/auth/permissions/org-permissions";
import { ORG_TYPES, OrgMetadata } from "@/lib/utils/types";
import { ZERO_ADDRESS } from "@/lib/web3/constants";
import { PrismaClient } from "@shared/db";
import { config as dotenvConfig } from "dotenv";

const ADMINS_DATA: Array<{
  role: AppRole;
  email: string;
  emailVerified: boolean;
  name: string;
}> = [
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
];

dotenvConfig();
const prismaClient = new PrismaClient();

async function main() {
  const result = await prismaClient.$transaction([
    prismaClient.user.count(),
    prismaClient.organization.count(),
    prismaClient.member.count(),
  ]);

  if (new Set(result).size > 1)
    throw new Error("Seeding error. Database not empty.");

  try {
    const adminsResult = await prismaClient.$transaction(
      ADMINS_DATA.map((data) => prismaClient.user.create({ data })),
    );

    console.log("Successfully seeded admins.");

    const adminId = adminsResult[2]!.id;

    const orgMetadata: OrgMetadata = {
      orgType: ORG_TYPES.SCOUTING,
      creatorUserId: adminId,
      reviewerAddress: ZERO_ADDRESS,
    };
    const defaultScoutingOrg = await prismaClient.organization.create({
      data: {
        id: process.env.NEXT_PUBLIC_DEFAULT_SCOUTING_ORG_ID,
        name: "SCOUTING_DEFAULT",
        slug: "scouting-default",
        metadata: JSON.stringify(orgMetadata),
      },
    });

    await prismaClient.member.create({
      data: {
        userId: adminId,
        organizationId: defaultScoutingOrg.id,
        role: ORG_ROLES.OWNER_ROLE,
      },
    });

    console.log("Default scouting organization seeded. OrganizationId:");
    console.log(defaultScoutingOrg.id);
  } catch {
    console.log("An error occured while seeding database.");
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
