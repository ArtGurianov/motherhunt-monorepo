import { createRandomStringGenerator } from "@better-auth/utils/random";
import { createHash } from "@better-auth/utils/hash";
import { base64Url } from "@better-auth/utils/base64";

//128 for vk
export const generateRandomString = createRandomStringGenerator(
  "a-z",
  "0-9",
  "A-Z",
  "-_"
);

export async function generateCodeChallenge(codeVerifier: string) {
  const codeChallengeBytes = await createHash("SHA-256").digest(codeVerifier);
  return base64Url.encode(new Uint8Array(codeChallengeBytes), {
    padding: false,
  });
}
