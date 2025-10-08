import { getActiveAgencyBookers } from "@/data/agencyBookers/getActiveAgencyBookers";
import {
  createApiResponse,
  CreateApiResponseProps,
} from "@/lib/utils/createApiResponse";

export async function GET() {
  let responseProps: CreateApiResponseProps;

  try {
    const bookers = await getActiveAgencyBookers();
    responseProps = { data: bookers };
  } catch (error) {
    responseProps = { error };
  }

  return createApiResponse(responseProps);
}
