"use server";

import { prismaClient } from "@/lib/db";
import { Session } from "@shared/db";

export const getSession = async (userId: string) => {
  let session: Session | null = null;
  try {
    session = await prismaClient.session.findFirst({ where: { userId } });
  } catch {}
  return session;
};
