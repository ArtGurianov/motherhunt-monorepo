"use server";

import { getSession } from "@/data/getSession";
import { ORG_ROLES } from "@/lib/auth/permissions/org-permissions";
import { getEnvConfigServer } from "@/lib/config/env";
import { prismaClient } from "@/lib/db";
import { APP_ROUTES, APP_ROUTES_CONFIG } from "@/lib/routes/routes";
import { vkCodeResponseSchema } from "@/lib/schemas/vkCodeResponseSchema";
import { vkUserResponseSchema } from "@/lib/schemas/vkUserResponseSchema";
import { createActionResponse } from "@/lib/utils/createActionResponse";
import { ORG_TYPES } from "@/lib/utils/types";
import { getAppURL } from "@shared/ui/lib/utils";
import { APIError } from "better-auth/api";
import z from "zod";

const vkTokensResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  id_token: z.string(),
  expires_in: z.number(),
  user_id: z.number(),
  state: z.string(),
  scope: z.string(),
});

const envConfig = getEnvConfigServer();

export const initializeModelVk = async (
  data: z.infer<typeof vkCodeResponseSchema>
) => {
  try {
    const session = await getSession();
    if (!session)
      throw new APIError("UNAUTHORIZED", { message: "Unauthorized" });

    const bodyValidationResult = vkCodeResponseSchema.safeParse(data);
    if (!bodyValidationResult.success)
      throw new APIError("BAD_REQUEST", { message: "Invalid args" });

    const tokensResponse = await fetch("https://id.vk.com/oauth2/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: envConfig.NEXT_PUBLIC_VK_CLIENT_ID,
        grant_type: "authorization_code",
        code_verifier: bodyValidationResult.data.state,
        device_id: bodyValidationResult.data.device_id,
        code: bodyValidationResult.data.code,
        redirect_uri: `${getAppURL()}${APP_ROUTES_CONFIG[APP_ROUTES.REDIRECT_FROM_VK].href}`,
      }),
    });

    const tokensData = await tokensResponse.json();
    const tokensValidationResult = vkTokensResponseSchema.safeParse(tokensData);

    if (!tokensValidationResult.success)
      throw new APIError("INTERNAL_SERVER_ERROR", {
        message: "VK ID Tokens already used or invalid.",
      });

    const userResponse = await fetch("https://id.vk.com/oauth2/user_info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: envConfig.NEXT_PUBLIC_VK_CLIENT_ID,
        access_token: tokensValidationResult.data.access_token,
      }),
    });

    const userData = await userResponse.json();
    const userValidationResult = vkUserResponseSchema.safeParse(userData);

    if (!userValidationResult.success)
      throw new APIError("INTERNAL_SERVER_ERROR", {
        message: "Received unexpected user data shape from VK ID",
      });

    const alreadyExists = await prismaClient.user.findFirst({
      where: { modelSocialId: `vk:${userValidationResult.data.user.user_id}` },
    });

    if (alreadyExists)
      throw new APIError("CONFLICT", {
        message:
          alreadyExists.id === session.user.id
            ? "You already linked your VK ID to the app."
            : "Person with this VK ID already exists in the system.",
      });

    await prismaClient.$transaction([
      prismaClient.user.update({
        where: { id: session.user.id },
        data: {
          recentOrganizationId: envConfig.NEXT_PUBLIC_DEFAULT_SCOUTING_ORG_ID,
          recentOrganizationName: "DEFAULT",
          recentOrganizationType: ORG_TYPES.SCOUTING,
          modelOrganizationId: envConfig.NEXT_PUBLIC_DEFAULT_SCOUTING_ORG_ID,
          modelSocialId: `vk:${userValidationResult.data.user.user_id}`,
        },
      }),
      prismaClient.session.update({
        where: { id: session.session.id },
        data: {
          activeOrganizationId: envConfig.NEXT_PUBLIC_DEFAULT_SCOUTING_ORG_ID,
          activeOrganizationName: "DEFAULT",
          activeOrganizationType: ORG_TYPES.SCOUTING,
          activeOrganizationRole: ORG_ROLES.MEMBER_ROLE,
        },
      }),
      prismaClient.member.create({
        data: {
          organizationId: envConfig.NEXT_PUBLIC_DEFAULT_SCOUTING_ORG_ID,
          userId: session.user.id,
          role: ORG_ROLES.MEMBER_ROLE,
        },
      }),
    ]);

    return createActionResponse();
  } catch (error) {
    return createActionResponse({ error });
  }
};
