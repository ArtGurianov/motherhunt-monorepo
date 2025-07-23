import { viemClient } from "./viemClient";
import { systemContractAbi } from "./abi";
import { prismaClient } from "../db";
import { APP_ROLES } from "../auth/permissions/app-permissions";
import { z } from "zod";
import { getEnvConfigServer } from "../config/env";
import { AppRole } from "@shared/db";
import { web3AdminRequestBodySchema } from "../auth/auth";
import { APIError } from "../auth/apiError";

const MapWeb3AdminRoles: Record<number, AppRole> = {
  0: APP_ROLES.SCOUTER_ROLE,
  1: APP_ROLES.MYDAOGS_ADMIN_ROLE,
  2: APP_ROLES.PROJECT_SUPERADMIN_ROLE,
  3: APP_ROLES.PROJECT_ADMIN_ROLE,
} as const;

const web3RoleValidator = z
  .number()
  .transform((value) => MapWeb3AdminRoles[value]);

export const getWeb3AdminUser = async ({
  address,
  signature,
}: z.infer<typeof web3AdminRequestBodySchema>) => {
  const isValidSignature = await viemClient.verifyMessage({
    address: address as `0x${string}`,
    message: "sign-in",
    signature: signature as `0x${string}`,
  });
  if (!isValidSignature)
    throw new APIError("FORBIDDEN", {
      message: "Invalid signature",
    });

  const blockchainRoleResult = await viemClient.readContract({
    abi: systemContractAbi,
    address: getEnvConfigServer()
      .NEXT_PUBLIC_SYSTEM_CONTRACT_ADDRESS as `0x${string}`,
    functionName: "getRoleByAddress",
    args: [address as `0x${string}`],
  });

  const roleVerificationResult =
    web3RoleValidator.safeParse(blockchainRoleResult);

  if (roleVerificationResult.error)
    throw new APIError("INTERNAL_SERVER_ERROR", {
      message: "Role parsing error",
    });

  if (roleVerificationResult.data === APP_ROLES.SCOUTER_ROLE)
    throw new APIError("FORBIDDEN", {
      message: "Not an admin",
    });

  const adminUser = await prismaClient.user.findFirst({
    where: { role: roleVerificationResult.data },
  });

  return adminUser;
};
