"use server";

import { v2 as cloudinary } from "cloudinary";
import { createActionResponse } from "@/lib/utils/createActionResponse";
import { getEnvConfigServer } from "@/lib/config/env";

const envConfig = getEnvConfigServer();

export const getCloudinarySignature = async () => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);

    const signature = cloudinary.utils.api_sign_request(
      {
        folder: "images",
        upload_preset: "profile_picture",
        timestamp,
      },
      envConfig.CLOUDINARY_SECRET_KEY,
    );
    return createActionResponse({ data: { signature, timestamp } });
  } catch (error) {
    return createActionResponse({ error });
  }
};
