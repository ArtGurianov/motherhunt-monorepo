"use server";

import { auth } from "@/lib/auth";

export const createHeadBooker = async ({
  userEmail,
  userName,
}: {
  userEmail: string;
  userName: string;
}) => {
  await auth.api.createUser({
    body: {
      name: userName,
      email: userEmail,
      password: "",
    },
  });
};
