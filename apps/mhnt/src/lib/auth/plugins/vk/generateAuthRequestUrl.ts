import { getEnvConfigClient } from "@/lib/config/env";
import { generateCodeChallenge, generateRandomString } from "@/lib/utils/pkce";
import { getAppURL } from "@shared/ui/lib/utils";

export const generateAuthRequestUrl = async () => {
  const envConfig = getEnvConfigClient();
  const codeVerifier = generateRandomString(128);
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  const params = new URLSearchParams({
    response_type: "code",
    client_id: envConfig.NEXT_PUBLIC_VK_CLIENT_ID,
    scope: "email",
    redirect_uri: `${getAppURL()}/api/auth/sign-in/vk`,
    state: codeVerifier,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  return `https://id.vk.com/authorize?${params.toString()}`;
};
