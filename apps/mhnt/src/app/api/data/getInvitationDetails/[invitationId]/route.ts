import { getInvitationDetails } from "@/data/invitationDetails/getInvitationDetails";
import {
  createApiResponse,
  CreateApiResponseProps,
} from "@/lib/utils/createApiResponse";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ invitationId: string }> }
) {
  let responseProps: CreateApiResponseProps;

  try {
    const { invitationId } = await params;
    const invitationDetails = await getInvitationDetails(invitationId);
    responseProps = { data: invitationDetails };
  } catch (error) {
    responseProps = { error };
  }

  return createApiResponse(responseProps);
}
