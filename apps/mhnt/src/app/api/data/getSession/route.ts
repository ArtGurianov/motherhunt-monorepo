import { getSession } from "@/data/session/getSession";
import {
  createApiResponse,
  CreateApiResponseProps,
} from "@/lib/utils/createApiResponse";

export async function GET() {
  let responseProps: CreateApiResponseProps;

  try {
    const session = await getSession();
    responseProps = { data: session };
  } catch (error) {
    responseProps = { error };
  }

  return createApiResponse(responseProps);
}
