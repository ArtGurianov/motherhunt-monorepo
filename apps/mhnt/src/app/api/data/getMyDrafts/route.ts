import { getMyDrafts } from "@/data/drafts/getMyDrafts";
import {
  createApiResponse,
  CreateApiResponseProps,
} from "@/lib/utils/createApiResponse";

export async function GET() {
  let responseProps: CreateApiResponseProps;

  try {
    const drafts = await getMyDrafts();
    responseProps = { data: drafts };
  } catch (error) {
    responseProps = { error };
  }

  return createApiResponse(responseProps);
}
